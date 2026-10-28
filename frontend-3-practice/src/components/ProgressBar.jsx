export default function ProgressBar({ currentStep = 4, totalSteps = 5 }) {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isActive   = stepNumber <= currentStep;
          const isCurrent  = stepNumber === currentStep;
          const isInactive = stepNumber > currentStep;
          const className = 'step' + (isActive ? ' active' : '') + (isCurrent ? ' current' : '') + (isInactive ? ' inactive' : '');
          return (
            <div key={stepNumber} className={className}>
              <span className="circle">{isActive ? stepNumber : ''}</span>
              {i < totalSteps - 1 && <div className="line" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}