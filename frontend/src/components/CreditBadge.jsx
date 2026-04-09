import './CreditBadge.css';

function CreditBadge({ credits, level }) {
  const levelColor = { Beginner: 'beginner', Mentor: 'mentor', Master: 'master' };
  return (
    <div className={`credit-badge credit-${levelColor[level] || 'beginner'}`}>
      <span className="credit-icon">💎</span>
      <span className="credit-value">{credits}</span>
      <span className="credit-level">{level}</span>
    </div>
  );
}

export default CreditBadge;
