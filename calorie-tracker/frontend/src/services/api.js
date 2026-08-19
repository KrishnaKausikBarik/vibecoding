const API_URL = 'http://localhost:8000/api';

export const api = {
  getDashboard: async () => {
    const res = await fetch(`${API_URL}/dashboard`);
    if(!res.ok) throw new Error("Failed to fetch dashboard");
    return res.json();
  },
  addMeal: async (foodName, portion) => {
    const res = await fetch(`${API_URL}/meals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food_name: foodName, portion_grams: portion })
    });
    if(!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to add meal");
    }
    return res.json();
  },
  deleteMeal: async (id) => {
    const res = await fetch(`${API_URL}/meals/${id}`, { method: 'DELETE' });
    if(!res.ok) throw new Error("Failed to delete meal");
    return res.json();
  },
  updateGoal: async (goal) => {
    const res = await fetch(`${API_URL}/goals/current`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal })
    });
    if(!res.ok) throw new Error("Failed to update goal");
    return res.json();
  },
  scanFood: async () => {
    const res = await fetch(`${API_URL}/scan-food`, { method: 'POST' });
    if(!res.ok) throw new Error("Failed to scan food");
    return res.json();
  }
};
