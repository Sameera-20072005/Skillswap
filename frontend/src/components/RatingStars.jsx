import './RatingStars.css';

function RatingStars({ rating, size = 16 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'star filled' : 'star'} style={{ fontSize: size }}>
        ★
      </span>
    );
  }
  return (
    <div className="rating-stars">
      {stars}
      <span className="rating-value">{rating.toFixed(1)}</span>
    </div>
  );
}

export default RatingStars;
