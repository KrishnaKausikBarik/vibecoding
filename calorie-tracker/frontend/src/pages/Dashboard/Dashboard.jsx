import { useState, useEffect, useMemo } from 'react';
import { Dna, Flame, Droplets } from 'lucide-react';
import Header from '../../components/Header/Header';
import FitnessGoalToggle from '../../components/FitnessGoalToggle/FitnessGoalToggle';
import CalorieBudget from '../../components/CalorieBudget/CalorieBudget';
import MacroCard from '../../components/MacroCard/MacroCard';
import DailySummary from '../../components/DailySummary/DailySummary';
import FoodLogger from '../../components/FoodLogger/FoodLogger';
import MealHistory from '../../components/MealHistory/MealHistory';
import BudgetExceededModal from '../../components/BudgetExceededModal/BudgetExceededModal';
import { foodDatabase } from '../../data/foodDatabase';
import { api } from '../../services/api';
import './Dashboard.css';

const goalsConfig = {
  weightLoss: { calories: 1800, protein: 120, carbs: 180, fat: 60 },
  weight_loss: { calories: 1800, protein: 120, carbs: 180, fat: 60 },
  maintenance: { calories: 2200, protein: 140, carbs: 250, fat: 70 },
  muscleGain: { calories: 2800, protein: 180, carbs: 320, fat: 80 },
  muscle_gain: { calories: 2800, protein: 180, carbs: 320, fat: 80 }
};

const initialFallbackMeals = [
  { id: 1, name: "Chicken Breast", portion: 150, calories: 248, protein: 46.5, carbs: 0, fat: 5.4 },
  { id: 2, name: "Rice", portion: 200, calories: 260, protein: 5.4, carbs: 56, fat: 0.6 }
];

function Dashboard() {
  const [selectedGoal, setSelectedGoal] = useState("maintenance");
  const [meals, setMeals] = useState(initialFallbackMeals);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ current: 0, target: 0, over: 0 });

  // Load from backend on mount
  useEffect(() => {
    api.getDashboard()
      .then(data => {
        if (data) {
          if (data.goal_id) setSelectedGoal(data.goal_id);
          if (data.meals) setMeals(data.meals);
        }
      })
      .catch(err => {
        console.warn("Backend not reached on initial load, using local state:", err);
      });
  }, []);

  const currentTargets = goalsConfig[selectedGoal] || goalsConfig.maintenance;

  const totals = useMemo(() => {
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [meals]);

  const handleAddMeal = async (foodName, portion) => {
    try {
      const res = await api.addMeal(foodName, portion);
      if (res && res.dashboard) {
        setMeals(res.dashboard.meals || []);
        if (res.dashboard.goal_id) setSelectedGoal(res.dashboard.goal_id);
        
        if (res.dashboard.budget && res.dashboard.budget.exceeded) {
          setModalData({
            current: res.dashboard.totals.calories,
            target: res.dashboard.goal.calories,
            over: res.dashboard.budget.overage
          });
          setShowModal(true);
        }
        return;
      }
    } catch (err) {
      console.warn("API add meal error, falling back to local calculation:", err);
    }

    // Fallback local logic
    const key = foodName.toLowerCase().trim().replace(/\s+/g, '');
    const dbItem = Object.entries(foodDatabase).find(([k, v]) => 
      k === key || v.name.toLowerCase() === foodName.toLowerCase()
    )?.[1];

    let nutrition;
    if (dbItem) {
      const factor = portion / 100;
      nutrition = {
        name: dbItem.name,
        calories: dbItem.calories * factor,
        protein: dbItem.protein * factor,
        carbs: dbItem.carbs * factor,
        fat: dbItem.fat * factor
      };
    } else {
      const factor = portion / 100;
      nutrition = {
        name: foodName,
        calories: 150 * factor,
        protein: 10 * factor,
        carbs: 20 * factor,
        fat: 5 * factor
      };
    }

    const newMeal = { id: Date.now(), portion, ...nutrition };
    const newTotalCal = totals.calories + newMeal.calories;
    if (totals.calories <= currentTargets.calories && newTotalCal > currentTargets.calories) {
      setModalData({
        current: newTotalCal,
        target: currentTargets.calories,
        over: newTotalCal - currentTargets.calories
      });
      setShowModal(true);
    }
    setMeals(prev => [newMeal, ...prev]);
  };

  const handleDeleteMeal = async (id) => {
    try {
      const res = await api.deleteMeal(id);
      if (res && res.meals) {
        setMeals(res.meals);
        return;
      }
    } catch (err) {
      console.warn("API delete error, falling back to local:", err);
    }
    setMeals(prev => prev.filter(meal => meal.id !== id));
  };

  const handleGoalChange = async (newGoal) => {
    setSelectedGoal(newGoal);
    try {
      await api.updateGoal(newGoal);
    } catch (err) {
      console.warn("API goal update error:", err);
    }
  };

  return (
    <div className="dashboard-layout">
      <Header />
      <main className="dashboard-content">
        <section className="top-section">
          <FitnessGoalToggle selectedGoal={selectedGoal} onGoalChange={handleGoalChange} />
          <CalorieBudget current={totals.calories} target={currentTargets.calories} />
          
          <div className="macros-grid">
            <MacroCard 
              name="Protein" 
              current={totals.protein} 
              target={currentTargets.protein} 
              unit="g" 
              icon={Dna} 
              color="#3b82f6" 
            />
            <MacroCard 
              name="Carbs" 
              current={totals.carbs} 
              target={currentTargets.carbs} 
              unit="g" 
              icon={Flame} 
              color="#eab308" 
            />
            <MacroCard 
              name="Fat" 
              current={totals.fat} 
              target={currentTargets.fat} 
              unit="g" 
              icon={Droplets} 
              color="#ef4444" 
            />
          </div>
        </section>

        <section className="summary-section">
          <DailySummary 
            remainingCal={currentTargets.calories - totals.calories}
            mealsLogged={meals.length}
            proteinRemaining={currentTargets.protein - totals.protein}
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

      <BudgetExceededModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        data={modalData} 
      />
    </div>
  );
}

export default Dashboard;
