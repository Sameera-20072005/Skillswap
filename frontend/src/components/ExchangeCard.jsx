import { useState } from 'react';
import Badge from './Badge';
import ConfirmModal from './ConfirmModal';
import './ExchangeCard.css';

const CONFIRM_CONFIG = {
  accept:   { title: 'Accept Exchange?',   message: 'This will schedule the session. The requester will be notified.',  confirmLabel: 'Accept',   confirmClass: 'btn-primary'   },
  reject:   { title: 'Reject Exchange?',   message: 'This will decline the request. This action cannot be undone.',     confirmLabel: 'Reject',   confirmClass: 'btn-danger'    },
  complete: { title: 'Mark as Completed?', message: 'Confirm that this live session has been completed by both parties.', confirmLabel: 'Complete', confirmClass: 'btn-secondary' },
};

function ExchangeCard({ exchange, users, onAction, currentUserId }) {
  const [confirm, setConfirm] = useState(null); // 'accept' | 'reject' | 'complete'

  const otherUserId = exchange.requesterId?.toString() === currentUserId?.toString()
    ? exchange.providerId
    : exchange.requesterId;
  const otherUser = users.find(u => u.id?.toString() === otherUserId?.toString());
  const isRequester = exchange.requesterId?.toString() === currentUserId?.toString();

  const handleConfirm = () => {
    onAction(confirm, exchange.id);
    setConfirm(null);
  };

  return (
    <>
      {confirm && (
        <ConfirmModal
          {...CONFIRM_CONFIG[confirm]}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="exchange-card card">
        {/* Header */}
        <div className="exchange-header">
          <img
            src={otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.name}`}
            alt={otherUser?.name}
            className="exchange-avatar"
          />
          <div className="exchange-header-info">
            <h4>{otherUser?.name || 'Unknown User'}</h4>
            <span className="exchange-role">{isRequester ? 'You requested' : 'Requested from you'}</span>
          </div>
          <Badge status={exchange.status}>{exchange.status}</Badge>
        </div>

        {/* Skills */}
        <div className="exchange-skills">
          <div className="skill-exchange">
            <span className="label">You teach</span>
            <span className="skill">{exchange.skillOffered}</span>
          </div>
          <div className="exchange-arrow">⇄</div>
          <div className="skill-exchange">
            <span className="label">You learn</span>
            <span className="skill">{exchange.skillRequested}</span>
          </div>
        </div>

        {/* Session meta */}
        <div className="session-info">
          <div className="session-detail">
            <span className="detail-icon">⏱️</span>
            <span>{exchange.sessionDuration}</span>
          </div>
          <div className="session-detail">
            <span className="detail-icon">{exchange.sessionMode === 'online' ? '💻' : '🏫'}</span>
            <span>{exchange.sessionMode === 'online' ? 'Online' : 'In-Person'}</span>
          </div>
          {exchange.scheduledDate && (
            <div className="session-detail">
              <span className="detail-icon">📅</span>
              <span>{exchange.scheduledDate} {exchange.scheduledTime && `at ${exchange.scheduledTime}`}</span>
            </div>
          )}
        </div>

        {/* Meeting link */}
        {exchange.meetingLink && exchange.sessionMode === 'online' && (
          <div className="meeting-link">
            <strong>🔗 Meeting Link:</strong>
            <a href={exchange.meetingLink} target="_blank" rel="noopener noreferrer">
              {exchange.meetingLink}
            </a>
          </div>
        )}

        {/* Actions */}
        {onAction && (
          <div className="exchange-actions">
            {exchange.status === 'pending' && !isRequester && (
              <>
                <button className="btn btn-primary" onClick={() => setConfirm('accept')}>Accept</button>
                <button className="btn btn-outline btn-danger-outline" onClick={() => setConfirm('reject')}>Reject</button>
              </>
            )}
            {exchange.status === 'pending' && isRequester && (
              <span className="waiting-label">⏳ Waiting for response...</span>
            )}
            {exchange.status === 'scheduled' && (
              <button className="btn btn-secondary" onClick={() => setConfirm('complete')}>
                ✅ Mark as Completed
              </button>
            )}
            {exchange.status === 'completed' && (
              <button className="btn btn-outline" onClick={() => onAction('feedback', exchange.id)}>
                ⭐ Leave Feedback
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ExchangeCard;
