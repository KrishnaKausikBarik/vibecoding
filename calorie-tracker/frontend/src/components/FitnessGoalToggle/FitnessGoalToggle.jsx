import './FitnessGoalToggle.css';

function FitnessGoalToggle({ selectedGoal, onGoalChange }) {
  const goals = [
    { id: 'weightLoss', label: 'Weight Loss' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'muscleGain', label: 'Muscle Gain' }
  ];

  // Map to handle both snake_case from backend and camelCase
  const normalizedSelected = selectedGoal === 'weight_loss' ? 'weightLoss' 
    : selectedGoal === 'muscle_gain' ? 'muscleGain' 
    : selectedGoal;

  return (
    <div className="goal-toggle-container">
      <h3>Fitness Goal</h3>
      <div className="segmented-control">
        {goals.map(goal => (
          <button
            key={goal.id}
            type="button"
            className={`segment ${normalizedSelected === goal.id ? 'active' : ''}`}
            onClick={() => onGoalChange(goal.id)}
          >
            {goal.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FitnessGoalToggle;
