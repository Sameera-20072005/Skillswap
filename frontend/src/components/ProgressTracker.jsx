import './ProgressTracker.css';

const STEP_ICONS = ['📤', '✅', '📅', '🎓', '⭐'];

function ProgressTracker({ currentStep, steps }) {
  return (
    <div className="progress-tracker">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive    = index === currentStep;
        return (
          <div key={index} className="tracker-step">
            <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              {isCompleted ? '✓' : <span className="step-icon">{STEP_ICONS[index]}</span>}
            </div>
            <div className={`step-label ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              {step}
            </div>
            {index < steps.length - 1 && (
              <div className={`step-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressTracker;
