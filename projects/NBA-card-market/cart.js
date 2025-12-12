const cartsByUser = {};

function ensureCart(username) {
  if (!cartsByUser[username]) {
    cartsByUser[username] = {
      username,
      items: [],
    };
  }
  return cartsByUser[username];
}

function getCart(username) {
  return ensureCart(username);
}

function setItem(username, cardId, quantity) {
  const cart = ensureCart(username);
  const existing = cart.items.find((item) => item.cardId === cardId);
  if (quantity === 0) {
    if (existing) {
      cart.items = cart.items.filter((item) => item.cardId !== cardId);
    }
    return cart;
  }
  if (existing) {
    existing.quantity = quantity;
  } else {
    cart.items.push({
      cardId,
      quantity,
    });
  }
  return cart;
}

function removeItem(username, cardId) {
  const cart = ensureCart(username);
  cart.items = cart.items.filter((item) => item.cardId !== cardId);
  return cart;
}

function clearCart(username) {
  const cart = ensureCart(username);
  cart.items = [];
  return cart;
}

export default {
  getCart,
  setItem,
  removeItem,
  clearCart,
};