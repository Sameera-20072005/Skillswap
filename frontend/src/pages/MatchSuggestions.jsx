import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Star, Calendar, MapPin, Users } from 'lucide-react';
import { api } from '../mock/api';
import MatchCard from '../components/MatchCard';
import './MatchSuggestions.css';

const HOW_FACTORS = [
  { icon: Target,   title: 'Skill Compatibility',  desc: 'We match what you offer with what others need' },
  { icon: Star,     title: 'Reputation Score',      desc: 'Higher rated users get priority in suggestions' },
  { icon: Calendar, title: 'Availability',          desc: 'Users with overlapping schedules rank higher' },
  { icon: MapPin,   title: 'Campus Proximity',      desc: 'Same campus users get a compatibility boost' },
];

function MatchSuggestions() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadMatches(); }, []);

  const loadMatches = async () => {
    try {
      const data = await api.getMatchSuggestions(1);
      setMatches(data);
    } catch {
      console.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="match-suggestions page-enter">
      <div className="container">
        <div className="match-header">
          <div>
            <h1>Suggested Matches</h1>
            <p>Recommended users based on your skills and learning goals</p>
          </div>
        </div>

        {/* How matching works */}
        <div className="match-info card">
          <h3>How Matching Works</h3>
          <div className="match-factors">
            {HOW_FACTORS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="factor">
                <div className="factor-icon"><Icon size={22} /></div>
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        {matches.length > 0 ? (
          <div className="matches-section">
            <h2>Your Top Matches <span className="count-badge">{matches.length}</span></h2>
            <div className="matches-grid grid grid-2">
              {matches.map((match, idx) => (
                <MatchCard key={idx} match={match} onPropose={(user) => navigate('/exchange/new', { state: { targetUser: user } })} />
              ))}
            </div>
          </div>
        ) : (
          <div className="no-matches card">
            <Users size={48} className="no-matches-icon" />
            <h3>No matches found yet</h3>
            <p>Complete your profile with skills to get better match suggestions</p>
            <button className="btn btn-primary" onClick={() => navigate('/profile')}>Update Profile</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchSuggestions;
