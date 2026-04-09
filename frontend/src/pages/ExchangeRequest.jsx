import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Video, Mic, MessageSquare, Monitor, MapPin, Clock, Calendar, Send, X } from 'lucide-react';
import { api } from '../mock/api';
import Toast from '../components/Toast';
import './ExchangeRequest.css';

const SESSION_MODES = [
  { value: 'video',        label: 'Video Session',    icon: Video,          desc: 'Live face-to-face via Zoom / Meet' },
  { value: 'audio',        label: 'Audio Only',       icon: Mic,            desc: 'Voice call — no camera required 🔒' },
  { value: 'chat',         label: 'Chat-Based',       icon: MessageSquare,  desc: 'Text learning — great for privacy 🔒' },
  { value: 'screenshare',  label: 'Screen Share',     icon: Monitor,        desc: 'Best for coding & design sessions' },
  { value: 'in-person',   label: 'In-Person',         icon: MapPin,         desc: 'Meet on campus' },
];

const NEEDS_LINK = ['video', 'screenshare'];

function ExchangeRequest() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const targetUser = location.state?.targetUser;

  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    skillOffered: '', skillRequested: '',
    sessionDuration: '1 hour', sessionMode: 'video',
    meetingLink: '', message: '', preferredDate: '', preferredTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    api.getCurrentUser().then(setCurrentUser).catch(console.error);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.skillOffered) {
      setToast({ message: 'Please add skills to your profile before requesting an exchange.', type: 'warning' });
      return;
    }
    if (!formData.skillRequested) {
      setToast({ message: 'Please select a skill you want to learn.', type: 'warning' });
      return;
    }
    setLoading(true);
    try {
      await api.createExchange({ providerId: targetUser.id, ...formData });
      setToast({ message: 'Exchange request sent! 🎉', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch {
      setToast({ message: 'Failed to send request. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!targetUser) return (
    <div className="exchange-request page-enter">
      <div className="container">
        <div className="card empty-state">
          <Users size={48} className="empty-icon" />
          <h2>No user selected</h2>
          <p>Please select a user from the marketplace or matches</p>
          <button className="btn btn-primary" onClick={() => navigate('/marketplace')}>Go to Marketplace</button>
        </div>
      </div>
    </div>
  );

  if (!currentUser) return <div className="loading">Loading...</div>;

  const selectedMode = SESSION_MODES.find(m => m.value === formData.sessionMode);

  return (
    <div className="exchange-request page-enter">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="container">
        <div className="exchange-header">
          <h1>Schedule Live Session</h1>
          <p>Propose a peer learning session with <strong>{targetUser.name}</strong></p>
        </div>

        <div className="exchange-layout">
          <div className="exchange-form card">
            <form onSubmit={handleSubmit}>
              {/* Skills */}
              <div className="form-row">
                <div className="form-group">
                  <label>Skill You Offer</label>
                  <select name="skillOffered" value={formData.skillOffered} onChange={handleChange} required>
                    <option value="">Select a skill you offer</option>
                    {(currentUser.skillsOffered || []).map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                  {!(currentUser.skillsOffered?.length) && (
                    <p className="field-warning">You have no skills listed. <a href="/profile">Add skills in your profile</a> first.</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Skill You Want to Learn</label>
                  <select name="skillRequested" value={formData.skillRequested} onChange={handleChange} required>
                    <option value="">Select a skill you want</option>
                    {(targetUser.skillsOffered || []).map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Session mode */}
              <div className="form-group">
                <label>Preferred Learning Mode</label>
                <div className="mode-grid">
                  {SESSION_MODES.map(({ value, label, icon: Icon, desc }) => (
                    <button
                      key={value}
                      type="button"
                      className={`mode-card ${formData.sessionMode === value ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, sessionMode: value })}
                      title={desc}
                    >
                      <Icon size={20} />
                      <span className="mode-label">{label}</span>
                      <span className="mode-desc">{desc}</span>
                    </button>
                  ))}
                </div>
                {(formData.sessionMode === 'audio' || formData.sessionMode === 'chat') && (
                  <div className="privacy-note">
                    🔒 <strong>Privacy mode:</strong> {selectedMode?.desc}
                  </div>
                )}
              </div>

              {/* Meeting link */}
              {NEEDS_LINK.includes(formData.sessionMode) && (
                <div className="form-group">
                  <label>Meeting Link <span className="optional">(optional — can add later)</span></label>
                  <input type="url" name="meetingLink" value={formData.meetingLink} onChange={handleChange} placeholder="https://meet.google.com/..." />
                </div>
              )}

              {/* Duration + Date + Time */}
              <div className="form-row three-col">
                <div className="form-group">
                  <label><Clock size={14} /> Duration</label>
                  <select name="sessionDuration" value={formData.sessionDuration} onChange={handleChange} required>
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><Calendar size={14} /> Proposed Date</label>
                  <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div className="form-group">
                  <label><Clock size={14} /> Proposed Time</label>
                  <input type="time" name="preferredTime" value={formData.preferredTime} onChange={handleChange} required />
                </div>
              </div>

              {/* Message */}
              <div className="form-group">
                <label>Message <span className="optional">(optional)</span></label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Introduce yourself and explain what you'd like to learn..." rows={3} />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : <Send size={16} />}
                  {loading ? 'Sending...' : 'Send Proposal'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="exchange-sidebar">
            <div className="user-preview card">
              <img
                src={targetUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser.name}`}
                alt={targetUser.name}
                className="preview-avatar"
              />
              <h3>{targetUser.name}</h3>
              <span className={`badge badge-completed`}>{targetUser.level}</span>
              <p className="preview-bio">{targetUser.bio}</p>

              <div className="preview-section">
                <strong>Offers</strong>
                <div className="skill-tags">
                  {(targetUser.skillsOffered || []).map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                </div>
              </div>

              <div className="preview-section">
                <strong>Available</strong>
                <div className="availability-preview">
                  {(targetUser.availability || []).map((slot, i) => (
                    <div key={i} className="availability-item"><Calendar size={12} /> {slot}</div>
                  ))}
                </div>
              </div>

              <div className="preview-stats">
                <div className="preview-stat">
                  <span className="stat-value">⭐ {targetUser.rating?.toFixed(1)}</span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="preview-stat">
                  <span className="stat-value">💎 {targetUser.skillCredits}</span>
                  <span className="stat-label">Credits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExchangeRequest;
