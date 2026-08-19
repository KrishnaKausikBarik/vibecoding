from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random

from mock_data import FOOD_DATABASE
from goals import GOALS
import state
import nutrition
from models import MealCreate, GoalUpdate, CalculateRequest

app = FastAPI(title="Calorie Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/foods")
def get_foods():
    return {"foods": list(FOOD_DATABASE.values())}

@app.get("/api/foods/{food_name}")
def get_food(food_name: str):
    search_name = food_name.lower().strip()
    for key, val in FOOD_DATABASE.items():
        if val["name"].lower() == search_name or key == search_name:
            return val
    raise HTTPException(status_code=404, detail=f"Food '{food_name}' not found.")

@app.post("/api/nutrition/calculate")
def calculate_nutrition_endpoint(req: CalculateRequest):
    result = nutrition.calculate_nutrition(req.food_name, req.portion_grams)
    if not result:
        raise HTTPException(status_code=404, detail=f"Food '{req.food_name}' was not found in the nutrition database.")
    return result

@app.post("/api/scan-food")
def scan_food():
    mocks = [
        {"food_name": "Grilled Chicken Breast", "portion_grams": 150, "calories": 247.5, "protein": 46.5, "carbs": 0.0, "fat": 5.4},
        {"food_name": "Apple", "portion_grams": 200, "calories": 104.0, "protein": 0.6, "carbs": 27.6, "fat": 0.4},
        {"food_name": "Salmon", "portion_grams": 250, "calories": 520.0, "protein": 50.0, "carbs": 0.0, "fat": 32.5}
    ]
    return random.choice(mocks)

@app.get("/api/goals")
def get_goals():
    return GOALS

@app.get("/api/dashboard")
def get_dashboard():
    return state.get_dashboard_state()

@app.post("/api/meals")
def add_meal(req: MealCreate):
    result = nutrition.calculate_nutrition(req.food_name, req.portion_grams)
    if not result:
        raise HTTPException(status_code=404, detail=f"Food '{req.food_name}' was not found in the nutrition database.")
    
    meal = {
        "id": state.next_meal_id,
        "name": result["food_name"], 
        "portion": result["portion_grams"],
        "calories": result["calories"],
        "protein": result["protein"],
        "carbs": result["carbs"],
        "fat": result["fat"]
    }
    state.next_meal_id += 1
    state.meals.append(meal)
    
    return {
        "meal": meal,
        "dashboard": state.get_dashboard_state()
    }

@app.get("/api/meals")
def get_meals():
    dash = state.get_dashboard_state()
    return {
        "meals": dash["meals"],
        "totals": dash["totals"],
        "targets": dash["goal"],
        "budget": dash["budget"]
    }

@app.delete("/api/meals/{meal_id}")
def delete_meal(meal_id: int):
    idx_to_del = -1
    for i, m in enumerate(state.meals):
        if m["id"] == meal_id:
            idx_to_del = i
            break
            
    if idx_to_del == -1:
        raise HTTPException(status_code=404, detail="Meal not found")
        
    state.meals.pop(idx_to_del)
    return state.get_dashboard_state()

@app.put("/api/goals/current")
def update_goal(req: GoalUpdate):
    goal_key = req.goal.lower().replace("_", "")
    if goal_key == "weightloss":
        state.current_goal = "weight_loss"
    elif goal_key == "musclegain":
        state.current_goal = "muscle_gain"
    elif goal_key == "maintenance":
        state.current_goal = "maintenance"
    elif req.goal in GOALS:
        state.current_goal = req.goal
    else:
        raise HTTPException(status_code=400, detail="Invalid goal. Choose weight_loss, maintenance, or muscle_gain.")
    return state.get_dashboard_state()

