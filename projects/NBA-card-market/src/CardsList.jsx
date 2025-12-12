import CardItem from './CardItem.jsx';

export default function CardsList({ cards, cartItems, onAddToCart }) {
  const visibleCards = cards.filter(
    (card) => card.isActive !== false
  );

  const itemsInCart = cartItems || [];

  function getAvailableStock(card) {
    const found = itemsInCart.find((item) => item.cardId === card.id);
    const reservedQty = found ? found.quantity : 0;
    const remaining = card.stock - reservedQty;
    return remaining > 0 ? remaining : 0;
  }

  return (
    <section className="catalog">
      {visibleCards.length === 0 && (
        <p className="empty-hint">
          No cards match the current filters.
        </p>
      )}
      <div className="catalog-grid">
        {visibleCards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            availableStock={getAvailableStock(card)}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}