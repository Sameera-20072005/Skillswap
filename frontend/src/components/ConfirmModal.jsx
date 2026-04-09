import './ConfirmModal.css';

function ConfirmModal({ title, message, confirmLabel = 'Confirm', confirmClass = 'btn-primary', onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className={`btn ${confirmClass}`} onClick={onConfirm}>{confirmLabel}</button>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
