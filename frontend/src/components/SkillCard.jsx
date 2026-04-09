import { MapPin, Clock, ArrowRightLeft } from 'lucide-react';
import RatingStars from './RatingStars';
import './SkillCard.css';

function SkillCard({ user, skill, onRequest }) {
  const avatar = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;

  return (
    <div className="skill-card card">
      <div className="skill-card-header">
        <img src={avatar} alt={user.name} className="skill-avatar" />
        <div>
          <h3>{user.name}</h3>
          <span className="badge badge-accepted">{user.level}</span>
        </div>
      </div>

      <div className="skill-name">{skill}</div>

      <div className="skill-meta">
        <RatingStars rating={user.rating} />
        <span className="review-count">({user.reviewCount} reviews)</span>
      </div>

      {user.campus && (
        <div className="skill-campus">
          <MapPin size={13} />
          <span>{user.campus}</span>
        </div>
      )}

      {user.availability?.[0] && (
        <div className="skill-availability">
          <Clock size={13} />
          <span>{user.availability[0]}</span>
        </div>
      )}

      <button className="btn btn-primary" onClick={() => onRequest(user)}>
        <ArrowRightLeft size={15} />
        Request Exchange
      </button>
    </div>
  );
}

export default SkillCard;
