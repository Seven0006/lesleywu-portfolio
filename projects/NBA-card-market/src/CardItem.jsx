export default function CardItem({ card, availableStock, onAddToCart }) {
  function handleClick() {
    onAddToCart(card.id);
  }

  const stock =
    typeof availableStock === 'number' ? availableStock : card.stock;

  const isOut = stock <= 0;

  return (
    <article className="card-item">
      <img className="card-img" src={card.imageUrl} alt={card.playerName} />
      <h3 className="card-player">{card.playerName}</h3>
      <p className="card-meta">
        {card.team} · {card.year} · {card.brand}
      </p>
      {card.parallel && <p className="card-parallel">{card.parallel}</p>}
      {card.isGraded && (
        <p className="card-grade">
          {card.gradeCompany} {card.grade}
        </p>
      )}
      <p className="card-price">${card.price.toFixed(2)}</p>
      <p className="card-stock">Stock: {stock}</p>
      <button
        type="button"
        className="primary-btn"
        disabled={isOut}
        onClick={handleClick}
      >
        {isOut ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </article>
  );
}