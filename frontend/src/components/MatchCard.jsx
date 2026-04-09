import { ArrowRightLeft } from 'lucide-react';
import ProgressCircle from './ProgressCircle';
import RatingStars from './RatingStars';
import './MatchCard.css';

function MatchCard({ match, onPropose }) {
  const avatar = match.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(match.user.name)}`;

  return (
    <div className="match-card card">
      <div className="match-header">
        <img src={avatar} alt={match.user.name} className="match-avatar" />
        <div className="match-info">
          <h3>{match.user.name}</h3>
          <RatingStars rating={match.user.rating} />
          <span className="match-campus">{match.user.campus}</span>
        </div>
        <ProgressCircle percentage={match.matchPercentage} />
      </div>

      <div className="match-reason">
        <strong>Why this match?</strong>
        <p>{match.reason}</p>
      </div>

      <div className="compatibility-factors">
        {match.compatibilityFactors.map((factor, idx) => (
          <span key={idx} className="badge badge-scheduled">{factor}</span>
        ))}
      </div>

      <div className="match-skills">
        <div>
          <strong>Offers</strong>
          <div className="skill-tags">
            {(match.user.skillsOffered || []).slice(0, 3).map((skill, idx) => (
              <span key={idx} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
        <div>
          <strong>Needs</strong>
          <div className="skill-tags">
            {(match.user.skillsNeeded || []).slice(0, 3).map((skill, idx) => (
              <span key={idx} className="skill-tag secondary">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => onPropose(match.user)}>
        <ArrowRightLeft size={15} />
        Send Exchange Proposal
      </button>
    </div>
  );
}

export default MatchCard;
