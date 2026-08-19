import React, { useState, useMemo } from 'react';
import { 
  Activity, Settings, User, Flame, Dna, Droplets, 
  Camera, Upload, Plus, Trash2, AlertCircle, X 
} from 'lucide-react';
import './App.css';

// --- MOCK DATA ---
const foodDatabase = {
  rice: { name: "Rice", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  chicken: { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  egg: { name: "Egg", calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  banana: { name: "Banana", calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
  oats: { name: "Oats", calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
  apple: { name: "Apple", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  salmon: { name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 13 }
};

const goalsConfig = {
  weightLoss: { calories: 1800, protein: 120, carbs: 180, fat: 60 },
  maintenance: { calories: 2200, protein: 140, carbs: 250, fat: 70 },
  muscleGain: { calories: 2800, protein: 180, carbs: 320, fat: 80 }
};

const initialMeals = [
  { id: 1, name: "Chicken Breast", portion: 150, calories: 248, protein: 46.5, carbs: 0, fat: 5.4 },
  { id: 2, name: "Rice", portion: 200, calories: 260, protein: 5.4, carbs: 56, fat: 0.6 }
];


// --- COMPONENTS ---

function Header() {
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <header className="header">
      <div className="header-left">
        <Activity className="logo-icon" size={28} />
        <div className="brand">
          <h1>CalorieTrack</h1>
          <span>Daily Nutrition Dashboard</span>
        </div>
      </div>
      <div className="header-right">
        <span className="date">{date}</span>
        <button className="icon-btn" aria-label="Settings"><Settings size={20} /></button>
        <button className="icon-btn avatar" aria-label="Profile"><User size={20} /></button>
      </div>
    </header>
  );
}

function FitnessGoalToggle({ selectedGoal, onGoalChange }) {
  const goals = [
    { id: 'weightLoss', label: 'Weight Loss' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'muscleGain', label: 'Muscle Gain' }
  ];
  return (
    <div className="goal-toggle-container">
      <h3>Fitness Goal</h3>
      <div className="segmented-control">
        {goals.map(goal => (
          <button
            key={goal.id}
            className={`segment ${selectedGoal === goal.id ? 'active' : ''}`}
            onClick={() => onGoalChange(goal.id)}
          >
            {goal.label}
          </button>
        ))}
      </div>
    </div>
  );
}

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

function MacroCard({ name, current, target, unit, icon: Icon, color }) {
  const percentage = Math.min((current / target) * 100, 100);
  const isOver = current > target;

  return (
    <div className="macro-card card">
      <div className="macro-header">
        <div className="macro-title">
          <div className="macro-icon-wrapper" style={{ color: color, backgroundColor: `${color}20` }}>
            <Icon size={18} />
          </div>
          <h4>{name}</h4>
        </div>
        <span className="macro-percentage">{Math.round((current / target) * 100)}%</span>
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

function DailySummary({ remainingCal, mealsLogged, remainingProtein, currentGoal }) {
  const goalLabels = { weightLoss: 'Weight Loss', maintenance: 'Maintenance', muscleGain: 'Muscle Gain' };
  const summaryData = [
    { label: 'Calories Remaining', value: `${Math.max(0, Math.round(remainingCal))} kcal` },
    { label: 'Meals Logged', value: mealsLogged },
    { label: 'Protein Remaining', value: `${Math.max(0, Math.round(remainingProtein))} g` },
    { label: 'Current Goal', value: goalLabels[currentGoal] }
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

function ImageScanner({ onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onScanComplete({ name: 'Grilled Chicken Breast', portion: 150 });
    }, 1500);
  };

  return (
    <div className="image-scanner card">
      <div className="scanner-icon">
        <Camera size={32} />
      </div>
      <div className="scanner-content">
        <h4>Scan Food with AI</h4>
        <p>Upload a food image to automatically estimate nutrition.</p>
      </div>
      <button className="scan-btn" onClick={handleScan} disabled={isScanning}>
        <Upload size={18} />
        {isScanning ? 'Analyzing food...' : 'Upload Image'}
      </button>
    </div>
  );
}

function FoodLogger({ onAddMeal }) {
  const [foodName, setFoodName] = useState('');
  const [portion, setPortion] = useState('');
  const [error, setError] = useState('');

  const calculateNutrition = (foodKey, weight) => {
    const food = foodDatabase[foodKey];
    if (!food) return null;
    const factor = weight / 100;
    return {
      name: food.name,
      calories: food.calories * factor,
      protein: food.protein * factor,
      carbs: food.carbs * factor,
      fat: food.fat * factor
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!foodName.trim()) return setError('Please enter a food name.');
    if (!portion || isNaN(portion) || Number(portion) <= 0) return setError('Please enter a valid portion in grams.');

    const key = foodName.toLowerCase().trim().replace(/\s+/g, '');
    let nutrition = calculateNutrition(key, Number(portion));
    
    if (!nutrition) {
      // Mock calculation for unknown foods
      nutrition = {
        name: foodName,
        calories: 150 * (Number(portion)/100),
        protein: 10 * (Number(portion)/100),
        carbs: 20 * (Number(portion)/100),
        fat: 5 * (Number(portion)/100)
      };
    }

    onAddMeal({ id: Date.now(), portion: Number(portion), ...nutrition });
    setFoodName('');
    setPortion('');
  };

  const handleScanComplete = (scannedData) => {
    setFoodName(scannedData.name);
    setPortion(scannedData.portion);
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
              id="foodName" type="text" 
              placeholder="Enter food name (e.g., rice)..." 
              value={foodName} onChange={(e) => setFoodName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="portion">Portion (g)</label>
            <input 
              id="portion" type="number" 
              placeholder="Weight in grams" 
              value={portion} onChange={(e) => setPortion(e.target.value)}
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
      <button className="delete-btn" onClick={() => onDelete(meal.id)} aria-label="Delete meal">
        <Trash2 size={18} />
      </button>
    </div>
  );
}

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

function BudgetExceededModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose} aria-label="Close modal"><X size={20} /></button>
        <div className="modal-header">
          <AlertCircle className="warning-icon" size={32} />
          <h3>Daily Budget Exceeded!</h3>
        </div>
        <p className="modal-message">
          You've exceeded your daily calorie target by <strong>{Math.round(data.over)} kcal</strong>.
        </p>
        <div className="modal-stats">
          <div className="stat"><span>Current</span><strong>{Math.round(data.current)} kcal</strong></div>
          <div className="stat"><span>Target</span><strong>{Math.round(data.target)} kcal</strong></div>
          <div className="stat over"><span>Over</span><strong>{Math.round(data.over)} kcal</strong></div>
        </div>
        <button className="got-it-btn" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}


// --- MAIN DASHBOARD APP ---

export default function App() {
  const [selectedGoal, setSelectedGoal] = useState("maintenance");
  const [meals, setMeals] = useState(initialMeals);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ current: 0, target: 0, over: 0 });

  const currentTargets = goalsConfig[selectedGoal];

  const totals = useMemo(() => {
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [meals]);

  const handleAddMeal = (newMeal) => {
    const newTotalCal = totals.calories + newMeal.calories;
    if (totals.calories <= currentTargets.calories && newTotalCal > currentTargets.calories) {
      setModalData({
        current: newTotalCal,
        target: currentTargets.calories,
        over: newTotalCal - currentTargets.calories
      });
      setShowModal(true);
    }
    setMeals([newMeal, ...meals]);
  };

  const handleDeleteMeal = (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  return (
    <div className="app-container">
      <div className="dashboard-layout">
        <Header />
        <main className="dashboard-content">
          <section className="top-section">
            <FitnessGoalToggle selectedGoal={selectedGoal} onGoalChange={setSelectedGoal} />
            <CalorieBudget current={totals.calories} target={currentTargets.calories} />
            
            <div className="macros-grid">
              <MacroCard name="Protein" current={totals.protein} target={currentTargets.protein} unit="g" icon={Dna} color="#3b82f6" />
              <MacroCard name="Carbs" current={totals.carbs} target={currentTargets.carbs} unit="g" icon={Flame} color="#eab308" />
              <MacroCard name="Fat" current={totals.fat} target={currentTargets.fat} unit="g" icon={Droplets} color="#ef4444" />
            </div>
          </section>

          <section className="summary-section">
            <DailySummary 
              remainingCal={currentTargets.calories - totals.calories}
              mealsLogged={meals.length}
              remainingProtein={currentTargets.protein - totals.protein}
              currentGoal={selectedGoal}
            />
          </section>

          <section className="bottom-grid">
            <aside className="left-panel">
              <FoodLogger onAddMeal={handleAddMeal} />
            </aside>
            <div className="right-panel">
              <MealHistory meals={meals} onDeleteMeal={handleDeleteMeal} />
            </div>
          </section>
        </main>

        <BudgetExceededModal isOpen={showModal} onClose={() => setShowModal(false)} data={modalData} />
      </div>
    </div>
  );
}