import express from 'express';
import cookieParser from 'cookie-parser';

import sessions from './sessions.js';
import users from './users.js';
import cards from './cards.js';
import cart from './cart.js';
import orders from './orders.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json());

function getAuthedUser(req) {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !username) {
    return null;
  }
  const user = users.getUser(username);
  if (!user) {
    return null;
  }
  return user;
}

function requireAuth(req, res) {
  const user = getAuthedUser(req);
  if (!user) {
    res.status(401).json({ error: 'auth-missing' });
    return null;
  }
  if (user.username === 'dog' || user.role === 'banned') {
    res.status(403).json({ error: 'auth-insufficient' });
    return null;
  }
  return user;
}

function requireAdmin(req, res) {
  const user = requireAuth(req, res);
  if (!user) {
    return null;
  }
  if (user.role !== 'admin') {
    res.status(403).json({ error: 'auth-insufficient' });
    return null;
  }
  return user;
}


app.get('/api/session', (req, res) => {
  const user = getAuthedUser(req);
  if (!user) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { username, password } = req.body || {};
  const result = users.registerUser(username, password);

  if (result.error === 'required-username') {
    res.status(400).json({ error: 'required-username' });
    return;
  }
  if (result.error === 'required-password') {
    res.status(400).json({ error: 'required-password' });
    return;
  }
  if (result.error === 'user-exists') {
    res.status(409).json({ error: 'user-exists' });
    return;
  }

  const user = result.user;
  const safeUser = {
    username: user.username,
    role: user.role,
  };

  res.status(201).json(safeUser);
});


app.post('/api/session', (req, res) => {
  const { username, password } = req.body || {};

  const result = users.loginUser(username, password);

  if (result.error === 'required-username') {
    res.status(400).json({ error: 'required-username' });
    return;
  }
  if (result.error === 'required-password') {
    res.status(400).json({ error: 'required-password' });
    return;
  }
  if (result.error === 'user-missing' || result.error === 'invalid-credentials') {
    res.status(403).json({ error: 'invalid-credentials' });
    return;
  }

  const user = result.user;

  if (user.username === 'dog' || user.role === 'banned') {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const sid = sessions.addSession(user.username);
  res.cookie('sid', sid);

  const safeUser = {
    username: user.username,
    role: user.role,
  };

  res.json(safeUser);
});


app.delete('/api/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (sid) {
    res.clearCookie('sid');
  }
  if (username) {
    sessions.deleteSession(sid);
  }

  res.json({ wasLoggedIn: !!username });
});


app.get('/api/cards', (req, res) => {
  const user = getAuthedUser(req);
  const isAdmin = user && user.role === 'admin';

  const filters = {
    player: req.query.player || '',
    team: req.query.team || '',
    minPrice: req.query.minPrice || '',
    maxPrice: req.query.maxPrice || '',
    year: req.query.year || '',
  };
  const result = cards.listCards(filters, { includeInactive: isAdmin });
  res.json({ cards: result });
});

app.post('/api/cards', (req, res) => {
  const user = requireAdmin(req, res);
  if (!user) {
    return;
  }
  const body = req.body || {};
  const result = cards.buildCardFromPayload(body);

  if (result.error) {
    res.status(400).json({ error: 'invalid-card' });
    return;
  }

  const cardObj = cards.addCard(result.card);
  res.status(201).json({ card: cardObj });
});

app.patch('/api/cards/:id', (req, res) => {
  const user = requireAdmin(req, res);
  if (!user) {
    return;
  }

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'card-not-found' });
    return;
  }

  const body = req.body || {};
  const result = cards.buildUpdatesFromPayload(body);
  if (result.error) {
    res.status(400).json({ error: 'invalid-card' });
    return;
  }

  const updated = cards.updateCard(id, result.updates);
  if (!updated) {
    res.status(404).json({ error: 'card-not-found' });
    return;
  }
  res.json({ card: updated });
});

app.delete('/api/cards/:id', (req, res) => {
  const user = requireAdmin(req, res);
  if (!user) {
    return;
  }

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'card-not-found' });
    return;
  }

  const deleted = cards.deleteCard(id);
  if (!deleted) {
    res.status(404).json({ error: 'card-not-found' });
    return;
  }
  res.json({ card: deleted });
});


function buildDetailedCart(username) {
  const userCart = cart.getCart(username);
  const items = userCart.items.map((item) => {
    const cardObj = cards.getCardById(item.cardId);
    return {
      cardId: item.cardId,
      quantity: item.quantity,
      card: cardObj || null,
    };
  });
  return { items };
}


app.get('/api/cart', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) {
    return;
  }
  const detailed = buildDetailedCart(user.username);
  res.json({ cart: detailed });
});


app.put('/api/cart/items', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) {
    return;
  }

  const body = req.body || {};
  const rawId = body.cardId;
  const rawQty = body.quantity;
  const cardId = Number(rawId);
  const quantity = Number(rawQty);

  if (!Number.isInteger(cardId) || cardId <= 0 || !Number.isFinite(quantity)) {
    res.status(400).json({ error: 'invalid-cart-payload' });
    return;
  }
  if (quantity < 0) {
    res.status(400).json({ error: 'invalid-quantity' });
    return;
  }

  const cardObj = cards.getCardById(cardId);
  if (!cardObj || !cardObj.isActive) {
    res.status(404).json({ error: 'card-not-found' });
    return;
  }
  if (quantity > cardObj.stock) {
    res.status(400).json({ error: 'out-of-stock' });
    return;
  }

  cart.setItem(user.username, cardId, quantity);
  const detailed = buildDetailedCart(user.username);
  res.json({ cart: detailed });
});


app.patch('/api/cart/items/:id', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) {
    return;
  }

  const cardId = Number(req.params.id);
  const rawQty = req.body && req.body.quantity;
  const quantity = Number(rawQty);

  if (!Number.isInteger(cardId) || cardId <= 0 || !Number.isFinite(quantity)) {
    res.status(400).json({ error: 'invalid-cart-payload' });
    return;
  }
  if (quantity < 0) {
    res.status(400).json({ error: 'invalid-quantity' });
    return;
  }

  const cardObj = cards.getCardById(cardId);
  if (!cardObj || !cardObj.isActive) {
    res.status(404).json({ error: 'card-not-found' });
    return;
  }
  if (quantity > cardObj.stock) {
    res.status(400).json({ error: 'out-of-stock' });
    return;
  }

  cart.setItem(user.username, cardId, quantity);
  const detailed = buildDetailedCart(user.username);
  res.json({ cart: detailed });
});


app.delete('/api/cart/items/:id', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) {
    return;
  }

  const cardId = Number(req.params.id);
  if (!Number.isInteger(cardId) || cardId <= 0) {
    res.status(400).json({ error: 'invalid-cart-payload' });
    return;
  }

  cart.removeItem(user.username, cardId);
  const detailed = buildDetailedCart(user.username);
  res.json({ cart: detailed });
});


app.post('/api/checkout', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) {
    return;
  }

  const note = req.body && req.body.note;
  const result = orders.createOrder(user.username, note);

  if (result.error === 'empty-cart') {
    res.status(400).json({ error: 'empty-cart' });
    return;
  }
  if (result.error === 'out-of-stock') {
    res.status(400).json({ error: 'out-of-stock' });
    return;
  }
  if (result.error) {
    res.status(400).json({ error: 'invalid-order-update' });
    return;
  }

  const detailed = buildDetailedCart(user.username);
  res.json({ order: result.order, cart: detailed });
});


app.get('/api/orders', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) {
    return;
  }
  const list = orders.listOrdersByUser(user.username);
  res.json({ orders: list });
});


app.get('/api/admin/orders', (req, res) => {
  const user = requireAdmin(req, res);
  if (!user) {
    return;
  }
  const status = req.query.status || '';
  const list = orders.listAllOrders(status);
  res.json({ orders: list });
});


app.patch('/api/admin/orders/:id', (req, res) => {
  const user = requireAdmin(req, res);
  if (!user) {
    return;
  }

  const id = Number(req.params.id);
  const status = req.body && req.body.status;

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'invalid-order-update' });
    return;
  }

  const updated = orders.updateOrderStatus(id, status);

  if (updated.error === 'invalid-status') {
    res.status(400).json({ error: 'invalid-order-update' });
    return;
  }
  if (updated.error === 'not-found') {
    res.status(404).json({ error: 'invalid-order-update' });
    return;
  }

  res.json({ order: updated.order });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});