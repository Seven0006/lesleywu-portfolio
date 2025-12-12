function formatMoney(value) {
  return value.toFixed(2);
}

const STATUS_OPTIONS = ['pending', 'completed', 'cancelled'];

export default function AdminOrders({
  orders,
  statusFilter,
  onChangeFilter,
  onChangeStatus,
}) {
  function handleFilterChange(event) {
    onChangeFilter(event.target.value);
  }

  function handleStatusChange(orderId, event) {
    onChangeStatus(orderId, event.target.value);
  }

  return (
    <section className="admin-orders">
      <header className="admin-orders-header">
        <h1>All Orders (Admin)</h1>
        <label className="form-field">
          <span>Status Filter</span>
          <select value={statusFilter} onChange={handleFilterChange}>
            <option value="">All</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </header>
      {orders.length === 0 && (
        <p className="empty-hint">No orders match this filter.</p>
      )}
      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order.id} className="order-card admin-order-card">
            <header className="order-header">
              <div className="order-id">Order #{order.id}</div>
              <div className="order-status">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e)}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </header>
            <div className="order-meta">
              <span>User: {order.username}</span>
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