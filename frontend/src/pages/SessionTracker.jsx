import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Monitor, MapPin, Link2, CheckCircle, MessageSquare, Calendar } from 'lucide-react';
import { api } from '../mock/api';
import ProgressTracker from '../components/ProgressTracker';
import Badge from '../components/Badge';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import './SessionTracker.css';

const WORKFLOW_STEPS = ['Request Sent', 'Accepted', 'Scheduled', 'Completed', 'Feedback'];
const STATUS_STEP    = { pending: 0, accepted: 1, scheduled: 2, completed: 3, cancelled: -1 };

const MODE_ICONS = {
  video:       <Monitor size={14} />,
  audio:       <Clock size={14} />,
  chat:        <MessageSquare size={14} />,
  screenshare: <Monitor size={14} />,
  'in-person': <MapPin size={14} />,
  online:      <Monitor size={14} />,
};

const MODE_LABELS = {
  video: 'Video Session', audio: 'Audio Only', chat: 'Chat-Based',
  screenshare: 'Screen Share', 'in-person': 'In-Person', online: 'Online Session',
};

function SessionTracker() {
  const [exchanges, setExchanges]     = useState([]);
  const [allUsers, setAllUsers]       = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState(null);
  const [confirmId, setConfirmId]     = useState(null);
  const navigate = useNavigate();

  const showToast = useCallback((msg, type = 'success') => setToast({ message: msg, type }), []);

  useEffect(() => { loadSessions(); }, []);

  const loadSessions = async () => {
    try {
      const [data, usersData, me] = await Promise.all([
        api.getExchanges(), api.getAllUsers(), api.getCurrentUser()
      ]);
      setExchanges(data);
      setAllUsers(usersData);
      setCurrentUser(me);
    } catch {
      showToast('Failed to load sessions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      const result = await api.completeSession(confirmId);
      showToast(result.message || 'Session marked as completed!');
      const updated = await api.getExchanges();
      setExchanges(updated);
    } catch {
      showToast('Failed to complete session.', 'error');
    } finally {
      setConfirmId(null);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="session-tracker page-enter">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {confirmId && (
        <ConfirmModal
          title="Mark as Completed?"
          message="Confirm that this live session has been completed. Both participants will earn 1 skill credit."
          confirmLabel="Complete Session"
          confirmClass="btn-secondary"
          onConfirm={handleComplete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div className="container">
        <div className="tracker-header">
          <h1>Session Tracker</h1>
          <p>Track your skill exchange workflow from request to completion</p>
        </div>

        {/* Workflow legend — show step 0 (first step only active) as reference */}
        <div className="workflow-legend card">
          <h3>Exchange Workflow</h3>
          <ProgressTracker currentStep={0} steps={WORKFLOW_STEPS} />
        </div>

        <div className="sessions-list">
          {exchanges.length > 0 ? exchanges.map(exchange => {
            const isRequester = exchange.requesterId?.toString() === currentUser?.id?.toString();
            const otherUserId = isRequester ? exchange.providerId : exchange.requesterId;
            const otherUser   = allUsers.find(u => u.id?.toString() === otherUserId?.toString());
            const currentStep = STATUS_STEP[exchange.status] ?? 0;
            const avatar      = otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(otherUser?.name || 'user')}`;

            return (
              <div key={exchange.id} className="session-card card">
                {/* Header */}
                <div className="session-header">
                  <div className="session-user">
                    <img src={avatar} alt={otherUser?.name} className="session-avatar" />
                    <div>
                      <h3>{otherUser?.name || 'Unknown User'}</h3>
                      <div className="session-skills">
                        <span className="skill-badge offer">{exchange.skillOffered}</span>
                        <span className="exchange-arrow">⇄</span>
                        <span className="skill-badge request">{exchange.skillRequested}</span>
                      </div>
                    </div>
                  </div>
                  <Badge status={exchange.status}>{exchange.status}</Badge>
                </div>

                {/* Meta */}
                <div className="session-meta-info">
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>{exchange.sessionDuration}</span>
                  </div>
                  <div className="meta-item">
                    {MODE_ICONS[exchange.sessionMode] || <Monitor size={14} />}
                    <span>{MODE_LABELS[exchange.sessionMode] || exchange.sessionMode}</span>
                  </div>
                  {exchange.scheduledDate && (
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{exchange.scheduledDate}{exchange.scheduledTime && ` at ${exchange.scheduledTime}`}</span>
                    </div>
                  )}
                </div>

                {/* Progress stepper — only show for non-cancelled */}
                {exchange.status !== 'cancelled' && (
                  <div className="session-progress">
                    <ProgressTracker currentStep={currentStep} steps={WORKFLOW_STEPS} />
                  </div>
                )}

                {/* Details */}
                <div className="session-details">
                  {exchange.message && (
                    <div className="session-message">
                      <strong>Message</strong>
                      <p>{exchange.message}</p>
                    </div>
                  )}

                  {exchange.meetingLink && (
                    <div className="session-meeting-link">
                      <Link2 size={14} />
                      <a href={exchange.meetingLink} target="_blank" rel="noopener noreferrer">
                        {exchange.meetingLink}
                      </a>
                    </div>
                  )}

                  <div className="session-meta">
                    <span>Created: {new Date(exchange.createdAt).toLocaleDateString()}</span>
                    {exchange.completedAt && (
                      <span>Completed: {new Date(exchange.completedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {exchange.status === 'scheduled' && (
                  <div className="session-actions">
                    <button className="btn btn-secondary" onClick={() => setConfirmId(exchange.id)}>
                      <CheckCircle size={15} /> Mark as Completed
                    </button>
                  </div>
                )}

                {exchange.status === 'completed' && (
                  <div className="session-actions">
                    <button className="btn btn-outline" onClick={() => navigate(`/feedback/${exchange.id}`)}>
                      Leave Feedback
                    </button>
                    <span className="credit-earned">+1 credit earned</span>
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="no-sessions card">
              <Calendar size={48} className="no-sessions-icon" />
              <h3>No sessions yet</h3>
              <p>Start by requesting an exchange from the marketplace</p>
              <button className="btn btn-primary" onClick={() => navigate('/marketplace')}>
                Browse Marketplace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SessionTracker;
