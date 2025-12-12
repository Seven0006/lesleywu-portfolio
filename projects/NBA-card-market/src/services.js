function handleResponse(response) {
  if (!response.ok) {
    return response
      .json()
      .catch(() => {
        return Promise.reject({ error: 'network-error' });
      })
      .then((data) => {
        if (data && data.error) {
          return Promise.reject(data);
        }
        return Promise.reject({ error: 'network-error' });
      });
  }
  return response.json().catch(() => {
    return {};
  });
}

function handleNetworkError() {
  return Promise.reject({ error: 'network-error' });
}

export function fetchSession() {
  return fetch('/api/session', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleResponse, handleNetworkError);
}

export function fetchRegister(username, password) {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  }).then(handleResponse, handleNetworkError);
}

export function fetchLogin(username, password) {
  return fetch('/api/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  }).then(handleResponse, handleNetworkError);
}


export function fetchLogout() {
  return fetch('/api/session', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleResponse, handleNetworkError);
}

export function fetchCards(filters) {
  const params = new URLSearchParams();
  if (filters.player) {
    params.set('player', filters.player);
  }
  if (filters.team) {
    params.set('team', filters.team);
  }
  if (filters.minPrice) {
    params.set('minPrice', filters.minPrice);
  }
  if (filters.maxPrice) {
    params.set('maxPrice', filters.maxPrice);
  }
  if (filters.year) {
    params.set('year', filters.year);
  }
  const query = params.toString();
  const url = query ? `/api/cards?${query}` : '/api/cards';

  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleResponse, handleNetworkError);
}

export function fetchCart() {
  return fetch('/api/cart', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleResponse, handleNetworkError);
}

export function fetchSetCartItem(cardId, quantity) {
  return fetch('/api/cart/items', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cardId, quantity }),
  }).then(handleResponse, handleNetworkError);
}

export function fetchUpdateCartItem(cardId, quantity) {
  return fetch(`/api/cart/items/${encodeURIComponent(cardId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  }).then(handleResponse, handleNetworkError);
}

export function fetchRemoveCartItem(cardId) {
  return fetch(`/api/cart/items/${encodeURIComponent(cardId)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleResponse, handleNetworkError);
}

export function fetchCheckout(note) {
  return fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ note }),
  }).then(handleResponse, handleNetworkError);
}

export function fetchOrders() {
  return fetch('/api/orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleResponse, handleNetworkError);
}

export function fetchAdminOrders(status) {
  const params = new URLSearchParams();
  if (status) {
    params.set('status', status);
  }
  const query = params.toString();
  const url = query ? `/api/admin/orders?${query}` : '/api/admin/orders';

  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleResponse, handleNetworkError);
}

export function fetchAdminUpdateOrderStatus(orderId, status) {
  return fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  }).then(handleResponse, handleNetworkError);
}

export function fetchAdminCreateCard(card) {
  return fetch('/api/cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(card),
  }).then(handleResponse, handleNetworkError);
}

export function fetchAdminUpdateCard(id, updates) {
  return fetch(`/api/cards/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  }).then(handleResponse, handleNetworkError);
}

export function fetchAdminDeleteCard(id) {
  return fetch(`/api/cards/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleResponse, handleNetworkError);
}