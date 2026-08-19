import React from 'react';
import MealItem from './MealItem';
import './MealHistory.css';

function MealHistory({ meals, onDeleteMeal }) {
  return (
    <div className="meal-history card">
      <h3>Today's Food Log</h3>
      {meals.length === 0 ? (
        <div className="empty-state">
          <p>No meals logged today. Start adding food!</p>
        </div>
      ) : (
        <div className="meals-list">
          <div className="meals-header desktop-only">
            <span className="col-food">Food</span>
            <span className="col-macros">Nutrition</span>
            <span className="col-action"></span>
          </div>
          {meals.map(meal => (
            <MealItem key={meal.id} meal={meal} onDelete={onDeleteMeal} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MealHistory;
