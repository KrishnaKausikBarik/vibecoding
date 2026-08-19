import { useState } from 'react';
import { Plus } from 'lucide-react';
import ImageScanner from '../ImageScanner/ImageScanner';
import './FoodLogger.css';

function FoodLogger({ onAddMeal }) {
  const [foodName, setFoodName] = useState('');
  const [portion, setPortion] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!foodName.trim()) return setError('Please enter a food name.');
    if (!portion || isNaN(portion) || Number(portion) <= 0) return setError('Please enter a valid portion in grams.');

    onAddMeal(foodName.trim(), Number(portion));
    setFoodName('');
    setPortion('');
  };

  const handleScanComplete = (scannedData) => {
    setFoodName(scannedData.name);
    setPortion(scannedData.portion.toString());
    setError('');
  };

  return (
    <div className="logger-container">
      <div className="food-logger card">
        <h3>Log Food</h3>
        <form onSubmit={handleSubmit} className="logger-form">
          <div className="form-group">
            <label htmlFor="foodName">Food Name</label>
            <input 
              id="foodName" 
              type="text" 
              placeholder="Enter food name (e.g., rice)..." 
              value={foodName} 
              onChange={(e) => { setFoodName(e.target.value); setError(''); }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="portion">Portion (g)</label>
            <input 
              id="portion" 
              type="number" 
              placeholder="Weight in grams" 
              value={portion} 
              onChange={(e) => { setPortion(e.target.value); setError(''); }}
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="add-btn">
            <Plus size={18} /> Add Food
          </button>
        </form>
      </div>
      <ImageScanner onScanComplete={handleScanComplete} />
    </div>
  );
}

export default FoodLogger;
