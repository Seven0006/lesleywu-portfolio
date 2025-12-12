import cart from './cart.js';
import cards from './cards.js';

const orders = [];
let nextOrderId = 1;

function sanitizeNote(note) {
  if (!note) {
    return '';
  }
  const text = String(note);
  return text.slice(0, 200);
}

function createOrder(username, note) {
  const userCart = cart.getCart(username);
  const items = userCart.items.filter((item) => item.quantity > 0);
  if (!items.length) {
    return { error: 'empty-cart' };
  }
  const snapshots = [];
  let total = 0;

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const cardObj = cards.getCardById(item.cardId);
    if (!cardObj || !cardObj.isActive) {
      return { error: 'out-of-stock' };
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return { error: 'out-of-stock' };
    }
    if (item.quantity > cardObj.stock) {
      return { error: 'out-of-stock' };
    }
  }

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const cardObj = cards.getCardById(item.cardId);
    const priceAtPurchase = cardObj.price;
    const snapshot = {
      id: cardObj.id,
      playerName: cardObj.playerName,
      team: cardObj.team,
      year: cardObj.year,
      brand: cardObj.brand,
      parallel: cardObj.parallel,
      isGraded: cardObj.isGraded,
      gradeCompany: cardObj.gradeCompany,
      grade: cardObj.grade,
      imageUrl: cardObj.imageUrl,
    };
    snapshots.push({
      cardId: cardObj.id,
      quantity: item.quantity,
      priceAtPurchase,
      snapshot,
    });
    total += priceAtPurchase * item.quantity;
    cards.decreaseStock(cardObj.id, item.quantity);
  }

  cart.clearCart(username);

  const order = {
    id: nextOrderId++,
    username,
    items: snapshots,
    total,
    note: sanitizeNote(note),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  return { order };
}

function listOrdersByUser(username) {
  return orders.filter((order) => order.username === username);
}

function listAllOrders(statusFilter) {
  const status = statusFilter ? String(statusFilter) : '';
  if (!status) {
    return orders.slice();
  }
  return orders.filter((order) => order.status === status);
}

function updateOrderStatus(id, status) {
  const allowed = ['pending', 'completed', 'cancelled'];
  if (!allowed.includes(status)) {
    return { error: 'invalid-status' };
  }
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return { error: 'not-found' };
  }
  order.status = status;
  return { order };
}

export default {
  createOrder,
  listOrdersByUser,
  listAllOrders,
  updateOrderStatus,
};