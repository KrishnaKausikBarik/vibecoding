import React from 'react';
import './DailySummary.css';

function DailySummary({ remainingCal, mealsLogged, remainingProtein, currentGoal }) {
  const goalLabels = { 
    weightLoss: 'Weight Loss', 
    weight_loss: 'Weight Loss', 
    maintenance: 'Maintenance', 
    muscleGain: 'Muscle Gain', 
    muscle_gain: 'Muscle Gain' 
  };

  const summaryData = [
    { label: 'Calories Remaining', value: `${Math.max(0, Math.round(remainingCal))} kcal` },
    { label: 'Meals Logged', value: mealsLogged },
    { label: 'Protein Remaining', value: `${Math.max(0, Math.round(remainingProtein))} g` },
    { label: 'Current Goal', value: goalLabels[currentGoal] || currentGoal }
  ];

  return (
    <div className="daily-summary">
      {summaryData.map((item, index) => (
        <div key={index} className="summary-card">
          <span className="summary-label">{item.label}</span>
          <span className="summary-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default DailySummary;
