import './MacroCard.css';

function MacroCard({ name, current, target, unit = 'g', icon: Icon, color }) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const rawPercentage = target > 0 ? Math.round((current / target) * 100) : 0;
  const isOver = current > target;

  return (
    <div className="macro-card card">
      <div className="macro-header">
        <div className="macro-title">
          <div className="macro-icon-wrapper" style={{ color: color, backgroundColor: `${color}20` }}>
            {Icon && <Icon size={18} />}
          </div>
          <h4>{name}</h4>
        </div>
        <span className="macro-percentage">{rawPercentage}%</span>
      </div>
      <div className="macro-numbers">
        <strong>{Math.round(current)}</strong> / {target} {unit}
      </div>
      <div className="macro-progress-track">
        <div 
          className="macro-progress-fill" 
          style={{ width: `${percentage}%`, backgroundColor: isOver ? 'var(--danger)' : color }}
        />
      </div>
    </div>
  );
}

export default MacroCard;
