function formatMoney(value) {
  return value.toFixed(2);
}

export default function OrdersView({ orders }) {
  if (!orders.length) {
    return (
      <section className="orders-view">
        <h1>My Orders</h1>
        <p className="empty-hint">You have not placed any orders yet.</p>
      </section>
    );
  }

  return (
    <section className="orders-view">
      <h1>My Orders</h1>
      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order.id} className="order-card">
            <header className="order-header">
              <div className="order-id">Order #{order.id}</div>
              <div className="order-status">{order.status}</div>
            </header>
            <div className="order-meta">
              <span>Date: {new Date(order.createdAt).toLocaleString()}</span>
              <span>Total: ${formatMoney(order.total)}</span>
            </div>
            {order.note && (
              <div className="order-note">
                <span>Note:</span> {order.note}
              </div>
            )}
            <ul className="order-items">
              {order.items.map((item) => (
                <li key={item.cardId} className="order-item-row">
                  <div className="order-item-main">
                    <span className="order-item-name">
                      {item.snapshot.playerName}
                    </span>
                    <span className="order-item-meta">
                      {item.snapshot.team} · {item.snapshot.year} ·{' '}
                      {item.snapshot.brand}
                    </span>
                  </div>
                  <div className="order-item-details">
                    <span>Qty: {item.quantity}</span>
                    <span>
                      @ ${formatMoney(item.priceAtPurchase)} = $
                      {formatMoney(item.priceAtPurchase * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}