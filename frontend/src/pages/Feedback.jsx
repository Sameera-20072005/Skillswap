import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, Send, SkipForward } from 'lucide-react';
import { api } from '../mock/api';
import Toast from '../components/Toast';
import './Feedback.css';

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

function Feedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating]           = useState(0);
  const [hovered, setHovered]         = useState(0);
  const [comment, setComment]         = useState('');
  const [loading, setLoading]         = useState(false);
  const [toast, setToast]             = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setToast({ message: 'Please select a star rating.', type: 'warning' }); return; }

    setLoading(true);
    try {
      await api.submitReview({ exchangeId: id, rating, comment, createdAt: new Date().toISOString() });
      setToast({ message: 'Feedback submitted! You earned 1 skill credit 💎', type: 'success' });
      setTimeout(() => navigate('/sessions'), 1800);
    } catch {
      setToast({ message: 'Failed to submit feedback. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-page page-enter">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="container">
        <div className="feedback-container">
          <div className="feedback-card card">
            <div className="feedback-header">
              <h1>Leave Feedback</h1>
              <p>Help build trust in the community by sharing your experience</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="rating-section">
                <label>How was your experience?</label>
                <div className="star-rating">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-button ${star <= (hovered || rating) ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                    >
                      <Star size={32} fill={star <= (hovered || rating) ? '#f59e0b' : 'none'} color={star <= (hovered || rating) ? '#f59e0b' : '#cbd5e1'} />
                    </button>
                  ))}
                </div>
                {(hovered || rating) > 0 && (
                  <div className="rating-label">{LABELS[hovered || rating]}</div>
                )}
              </div>

              <div className="form-group">
                <label>Share your experience</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you learn? How was the teaching style? Would you recommend this person?"
                  rows={5}
                  required
                />
              </div>

              <div className="feedback-benefits">
                <h3>Feedback Rewards</h3>
                <ul>
                  {['Earn 1 skill credit per completed session', 'Help others make informed decisions', 'Build community trust', 'Improve your reputation score'].map(b => (
                    <li key={b}><Star size={14} fill="#f59e0b" color="#f59e0b" /> {b}</li>
                  ))}
                </ul>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : <Send size={16} />}
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => navigate('/sessions')}>
                  <SkipForward size={16} /> Skip for Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
