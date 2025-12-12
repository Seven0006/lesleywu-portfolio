import { useState } from 'react';

function formatMoney(value) {
  return value.toFixed(2);
}

export default function CartView({
  cart,
  onChangeQuantity,
  onRemoveItem,
  onCheckout,
}) {
  const [note, setNote] = useState('');

  const items = cart.items || [];

  const total = items.reduce((sum, item) => {
    if (!item.card) {
      return sum;
    }
    return sum + item.card.price * item.quantity;
  }, 0);

  function handleQtyChange(cardId, event) {
    const value = event.target.value;
    onChangeQuantity(cardId, value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onCheckout(note);
  }

  if (!items.length) {
    return (
      <section className="cart-view">
        <h1>Your Cart</h1>
        <p className="empty-hint">Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section className="cart-view">
      <h1>Your Cart</h1>
      <form className="cart-form" onSubmit={handleSubmit}>
        <ul className="cart-list">
          {items.map((item) => {
            const card = item.card;
            if (!card) {
              return null;
            }
            const lineTotal = card.price * item.quantity;
            return (
              <li key={item.cardId} className="cart-row">
                <div className="cart-card">
                  <img
                    className="cart-img"
                    src={card.imageUrl}
                    alt={card.playerName}
                  />
                  <div className="cart-card-info">
                    <div className="cart-player">{card.playerName}</div>
                    <div className="cart-meta">
                      {card.team} · {card.year} · {card.brand}
                    </div>
                    <div className="cart-price">
                      ${formatMoney(card.price)} each
                    </div>
                  </div>
                </div>
                <div className="cart-actions-group">
                  <label className="form-field cart-qty-field">
                    <span>Qty</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => handleQtyChange(item.cardId, e)}
                    />
                  </label>
                  <div className="cart-line-total">
                    ${formatMoney(lineTotal)}
                  </div>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => onRemoveItem(item.cardId)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <footer className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <strong>${formatMoney(total)}</strong>
          </div>
          <label className="form-field cart-note-field">
            <span>Order note (optional)</span>
            <textarea
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          <button type="submit" className="primary-btn">
            Checkout
          </button>
        </footer>
      </form>
    </section>
  );
}