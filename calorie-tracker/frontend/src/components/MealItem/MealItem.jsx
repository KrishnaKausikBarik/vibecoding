import { Trash2 } from 'lucide-react';
import './MealItem.css';

function MealItem({ meal, onDelete }) {
  return (
    <div className="meal-item">
      <div className="meal-info">
        <h4>{meal.name}</h4>
        <span className="meal-portion">{meal.portion}g</span>
      </div>
      <div className="meal-macros desktop-only">
        <span>{Math.round(meal.calories)} kcal</span>
        <span>{Math.round(meal.protein)}g P</span>
        <span>{Math.round(meal.carbs)}g C</span>
        <span>{Math.round(meal.fat)}g F</span>
      </div>
      <div className="meal-macros-mobile mobile-only">
        {Math.round(meal.calories)} kcal | {Math.round(meal.protein)}P • {Math.round(meal.carbs)}C • {Math.round(meal.fat)}F
      </div>
      <button 
        type="button" 
        className="delete-btn" 
        onClick={() => onDelete(meal.id)} 
        aria-label="Delete meal"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default MealItem;
