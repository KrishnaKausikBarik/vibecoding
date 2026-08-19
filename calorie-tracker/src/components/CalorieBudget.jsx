import React from 'react';
import { Flame } from 'lucide-react';
import './CalorieBudget.css';

function CalorieBudget({ current, target }) {
  const remaining = target - current;
  const isOver = current > target;
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="calorie-budget card">
      <div className="budget-header">
        <div className="budget-title">
          <Flame className="budget-icon" size={24} />
          <h2>Daily Calorie Budget</h2>
        </div>
        <div className="budget-numbers">
          <span className="current">{Math.round(current)}</span>
          <span className="target"> / {target} kcal</span>
        </div>
      </div>
      <div className="progress-container">
        <div className="progress-track">
          <div 
            className={`progress-fill ${isOver ? 'danger' : 'success'}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="budget-status">
        {isOver ? (
          <span className="status-text over">{Math.round(Math.abs(remaining))} kcal over budget</span>
        ) : (
          <span className="status-text remaining">{Math.round(remaining)} kcal remaining</span>
        )}
      </div>
    </div>
  );
}

export default CalorieBudget;
