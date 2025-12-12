import { useEffect, useState } from 'react';

import Controls from './Controls.jsx';
import Status from './Status.jsx';
import Loading from './Loading.jsx';
import CardsList from './CardsList.jsx';
import CartView from './CartView.jsx';
import LoginForm from './LoginForm.jsx';
import OrdersView from './OrdersView.jsx';
import AdminInventory from './AdminInventory.jsx';
import AdminOrders from './AdminOrders.jsx';

import { mapErrorToMessage } from './constants.js';

import {
  fetchSession,
  fetchRegister,
  fetchLogin,
  fetchLogout,
  fetchCards,
  fetchCart,
  fetchSetCartItem,
  fetchUpdateCartItem,
  fetchRemoveCartItem,
  fetchCheckout,
  fetchOrders,
  fetchAdminOrders,
  fetchAdminUpdateOrderStatus,
  fetchAdminCreateCard,
  fetchAdminUpdateCard,
  fetchAdminDeleteCard,
} from './services.js';

const VIEW_MARKET = 'market';
const VIEW_CART = 'cart';
const VIEW_SIGNIN = 'signin';
const VIEW_ORDERS = 'orders';
const VIEW_ADMIN_INVENTORY = 'admin-inventory';
const VIEW_ADMIN_ORDERS = 'admin-orders';

const initialCart = {
  items: [],
};

function computeCartCount(cart) {
  if (!cart || !cart.items) {
    return 0;
  }
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export default function App() {
  const [view, setView] = useState(VIEW_MARKET);
  const [authMode, setAuthMode] = useState('signin'); 
  const [user, setUser] = useState(null);

  const [cards, setCards] = useState([]);
  const [cartState, setCartState] = useState(initialCart);
  const [userOrders, setUserOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminStatusFilter, setAdminStatusFilter] = useState('');

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const cartCount = computeCartCount(cartState);
  const isAdmin = !!user && user.role === 'admin';


  function showStatusError(errorCode) {
    const message = mapErrorToMessage(errorCode);
    setStatus({
      type: 'error',
      message,
    });
  }

  function showStatusSuccess(message) {
    setStatus({
      type: 'success',
      message,
    });
  }

  function clearStatus() {
    setStatus({ type: '', message: '' });
  }

  function loadCards() {
    fetchCards({})
      .then(function onResult(data) {
        setCards(data.cards || []);
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      });
  }

  function loadCart() {
    setIsLoading(true);
    fetchCart()
      .then(function onResult(data) {
        setCartState(data.cart || initialCart);
      })
      .catch(function onError(err) {
        if (err.error === 'auth-missing') {
          setUser(null);
          setCartState(initialCart);
        } else {
          showStatusError(err.error || 'network-error');
        }
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function loadUserOrders() {
    setIsLoading(true);
    fetchOrders()
      .then(function onResult(data) {
        setUserOrders(data.orders || []);
      })
      .catch(function onError(err) {
        if (err.error === 'auth-missing') {
          setUser(null);
          setUserOrders([]);
        } else {
          showStatusError(err.error || 'network-error');
        }
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function loadAdminOrders(statusFilter) {
    if (!isAdmin) {
      setAdminOrders([]);
      return;
    }
    setIsLoading(true);
    fetchAdminOrders(statusFilter)
      .then(function onResult(data) {
        setAdminOrders(data.orders || []);
      })
      .catch(function onError(err) {
        if (
          err.error === 'auth-missing' ||
          err.error === 'auth-insufficient'
        ) {
          setAdminOrders([]);
        } else {
          showStatusError(err.error || 'network-error');
        }
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  useEffect(function () {
    setIsCheckingSession(true);
    fetchSession()
      .then(function onResult(userData) {
        setUser(userData);
        loadCart();
        loadUserOrders();
        if (userData.role === 'admin') {
          loadAdminOrders('');
        }
      })
      .catch(function onError() {
        setUser(null);
        setCartState(initialCart);
        setUserOrders([]);
        setAdminOrders([]);
      })
      .finally(function onFinally() {
        loadCards();
        setIsCheckingSession(false);
      });
  }, []);

  function handleChangeAuthMode(nextMode) {
    clearStatus();
    setAuthMode(nextMode || 'signin');
  }

  function handleAuthSubmit(username, password, modeFromForm) {
    const mode = modeFromForm || authMode;
    clearStatus();

    if (mode === 'signup') {
      setIsLoading(true);
      fetchRegister(username, password)
        .then(function onResult() {
          showStatusSuccess('Registration successful, please sign-in.');
          setAuthMode('signin');
          setView(VIEW_SIGNIN); 
        })
        .catch(function onError(err) {
          showStatusError(err.error || 'network-error');
        })
        .finally(function onFinally() {
          setIsLoading(false);
        });
      return;
    }

    setIsLoading(true);
    fetchLogin(username, password)
      .then(function onResult(userData) {
        setUser(userData);
        clearStatus(); 
        setView(VIEW_MARKET);
        loadCart();
        loadUserOrders();
        if (userData.role === 'admin') {
          loadAdminOrders(adminStatusFilter);
        }
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function handleLogout() {
    setIsLoading(true);
    fetchLogout()
      .then(function onResult() {
        setUser(null);
        setCartState(initialCart);
        setUserOrders([]);
        setAdminOrders([]);
        clearStatus();
        setView(VIEW_MARKET);
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function handleAddToCart(cardId) {
    if (!user) {
      showStatusError('login-required');
      setView(VIEW_SIGNIN);
      setAuthMode('signin');
      return;
    }

    const existingItem =
      cartState.items &&
      cartState.items.find((item) => item.cardId === cardId);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const nextQty = currentQty + 1;

    const card = cards.find((c) => c.id === cardId);
    if (card && nextQty > card.stock) {
      showStatusError('out-of-stock');
      return;
    }

    setIsLoading(true);
    fetchSetCartItem(cardId, nextQty)
      .then(function onResult(data) {
        setCartState(data.cart || initialCart);
        showStatusSuccess('Added to cart');
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function handleCartQuantityChange(cardId, quantity) {
    if (!user) {
      showStatusError('login-required');
      setView(VIEW_SIGNIN);
      setAuthMode('signin');
      return;
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 0) {
      showStatusError('invalid-quantity');
      return;
    }

    setIsLoading(true);

    const promise =
      qty === 0
        ? fetchRemoveCartItem(cardId)
        : fetchUpdateCartItem(cardId, qty);

    promise
      .then(function onResult(data) {
        setCartState(data.cart || initialCart);
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function handleRemoveFromCart(cardId) {
    if (!user) {
      showStatusError('login-required');
      setView(VIEW_SIGNIN);
      setAuthMode('signin');
      return;
    }

    setIsLoading(true);
    fetchRemoveCartItem(cardId)
      .then(function onResult(data) {
        setCartState(data.cart || initialCart);
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function handleCheckout(note) {
    if (!user) {
      showStatusError('login-required');
      setView(VIEW_SIGNIN);
      setAuthMode('signin');
      return;
    }

    setIsLoading(true);
    fetchCheckout(note)
      .then(function onResult(data) {
        setCartState(data.cart || initialCart);
        showStatusSuccess('Order submitted! 🎉');
        loadUserOrders();
        loadCards(); 
        if (isAdmin) {
          loadAdminOrders(adminStatusFilter);
        }
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function handleAdminAddCard(cardPayload) {
    if (!isAdmin) {
      showStatusError('auth-insufficient');
      return;
    }
    setIsLoading(true);
    fetchAdminCreateCard(cardPayload)
      .then(function onResult() {
        showStatusSuccess('Card created');
        loadCards();
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function handleAdminToggleActive(cardId, nextIsActive) {
    if (!isAdmin) {
      showStatusError('auth-insufficient');
      return;
    }
    setIsLoading(true);
    fetchAdminUpdateCard(cardId, { isActive: nextIsActive })
      .then(function onResult() {
        loadCards();
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function handleAdminUpdateCard(cardId, updates) {
    if (!isAdmin) {
      showStatusError('auth-insufficient');
      return;
    }
    setIsLoading(true);
    fetchAdminUpdateCard(cardId, updates)
      .then(function onResult() {
        showStatusSuccess('Card updated');
        loadCards();
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function handleAdminDeleteCard(cardId) {
    if (!isAdmin) {
      showStatusError('auth-insufficient');
      return;
    }
    setIsLoading(true);
    fetchAdminDeleteCard(cardId)
      .then(function onResult() {
        showStatusSuccess('Card deleted');
        loadCards();
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function handleAdminUpdateOrderStatus(orderId, status) {
    if (!isAdmin) {
      showStatusError('auth-insufficient');
      return;
    }
    setIsLoading(true);
    fetchAdminUpdateOrderStatus(orderId, status)
      .then(function onResult() {
        loadAdminOrders(adminStatusFilter);
      })
      .catch(function onError(err) {
        showStatusError(err.error || 'network-error');
      })
      .finally(function onFinally() {
        setIsLoading(false);
      });
  }

  function handleShowMarket() {
    clearStatus();
    setView(VIEW_MARKET);
  }

  function handleShowCart() {
    clearStatus();
    setView(VIEW_CART);
  }

  function handleShowOrders() {
    if (!user) {
      showStatusError('login-required');
      setView(VIEW_SIGNIN);
      setAuthMode('signin');
      return;
    }
    clearStatus();
    setView(VIEW_ORDERS);
    loadUserOrders();
  }

  function handleShowSignIn(mode) {
    clearStatus();
    setAuthMode(mode || 'signin');
    setView(VIEW_SIGNIN);
  }

  function handleShowAdminInventory() {
    if (!isAdmin) {
      showStatusError('auth-insufficient');
      return;
    }
    clearStatus();
    setView(VIEW_ADMIN_INVENTORY);
  }

  function handleShowAdminOrders() {
    if (!isAdmin) {
      showStatusError('auth-insufficient');
      return;
    }
    clearStatus();
    setView(VIEW_ADMIN_ORDERS);
    loadAdminOrders(adminStatusFilter);
  }

  return (
    <div className="app">
      <Controls
        user={user}
        cartCount={cartCount}
        onShowMarket={handleShowMarket}
        onShowCart={handleShowCart}
        onShowOrders={handleShowOrders}
        onShowSignIn={handleShowSignIn}
        onShowAdminInventory={handleShowAdminInventory}
        onShowAdminOrders={handleShowAdminOrders}
        onLogout={handleLogout}
      />

      <main className="app-main">
        <Status status={status} onClear={clearStatus} />
        <Loading show={isLoading || isCheckingSession} />

        {view === VIEW_MARKET && (
          <CardsList
            cards={cards}
            cartItems={cartState.items}
            onAddToCart={handleAddToCart}
          />
        )}

        {view === VIEW_CART && (
          <CartView
            cart={cartState}
            onChangeQuantity={handleCartQuantityChange}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
          />
        )}

        {view === VIEW_SIGNIN && (
          <LoginForm
            mode={authMode}
            onChangeMode={handleChangeAuthMode}
            onSubmit={handleAuthSubmit}
          />
        )}

        {view === VIEW_ORDERS && <OrdersView orders={userOrders} />}

        {isAdmin && view === VIEW_ADMIN_INVENTORY && (
          <AdminInventory
            cards={cards}
            onAddCard={handleAdminAddCard}
            onToggleActive={handleAdminToggleActive}
            onDeleteCard={handleAdminDeleteCard}
            onUpdateCard={handleAdminUpdateCard}
          />
        )}

        {isAdmin && view === VIEW_ADMIN_ORDERS && (
          <AdminOrders
            orders={adminOrders}
            statusFilter={adminStatusFilter}
            onChangeFilter={function onChangeFilter(nextStatus) {
              setAdminStatusFilter(nextStatus);
              loadAdminOrders(nextStatus);
            }}
            onChangeStatus={handleAdminUpdateOrderStatus}
          />
        )}
      </main>

      <footer className="app-footer">
        <span>© 2025 NBA Cards Market · Happy collecting! </span>
      </footer>
    </div>
  );
}