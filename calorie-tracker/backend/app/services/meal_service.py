from fastapi import HTTPException

from app.data.goals import GOALS
from app.services.budget_service import calculate_budget_status
from app.services.nutrition_service import calculate_nutrition
from app.state import store


def get_dashboard_state():
    target = GOALS[store.current_goal]

    total_cal = sum(m["calories"] for m in store.meals)
    total_pro = sum(m["protein"] for m in store.meals)
    total_carb = sum(m["carbs"] for m in store.meals)
    total_fat = sum(m["fat"] for m in store.meals)

    budget = calculate_budget_status(total_cal, target["calories"])

    macros = {
        "protein": {
            "current": round(total_pro, 1),
            "target": target["protein"],
            "percentage": round((total_pro / target["protein"]) * 100, 2) if target["protein"] else 0,
        },
        "carbs": {
            "current": round(total_carb, 1),
            "target": target["carbs"],
            "percentage": round((total_carb / target["carbs"]) * 100, 2) if target["carbs"] else 0,
        },
        "fat": {
            "current": round(total_fat, 1),
            "target": target["fat"],
            "percentage": round((total_fat / target["fat"]) * 100, 2) if target["fat"] else 0,
        },
    }

    return {
        "goal_id": store.current_goal,
        "goal": target,
        "totals": {
            "calories": round(total_cal, 1),
            "protein": round(total_pro, 1),
            "carbs": round(total_carb, 1),
            "fat": round(total_fat, 1),
        },
        "budget": budget,
        "macros": macros,
        "meals": store.meals,
    }


def add_meal(food_name, portion_grams):
    result = calculate_nutrition(food_name, portion_grams)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Food '{food_name}' was not found in the nutrition database.",
        )

    meal = {
        "id": store.next_meal_id,
        "name": result["food_name"],
        "portion": result["portion_grams"],
        "calories": result["calories"],
        "protein": result["protein"],
        "carbs": result["carbs"],
        "fat": result["fat"],
    }
    store.next_meal_id += 1
    store.meals.append(meal)

    return {
        "meal": meal,
        "dashboard": get_dashboard_state(),
    }


def get_meals_state():
    dashboard = get_dashboard_state()
    return {
        "meals": dashboard["meals"],
        "totals": dashboard["totals"],
        "targets": dashboard["goal"],
        "budget": dashboard["budget"],
    }


def delete_meal(meal_id):
    for index, meal in enumerate(store.meals):
        if meal["id"] == meal_id:
            store.meals.pop(index)
            return get_dashboard_state()

    raise HTTPException(status_code=404, detail="Meal not found")


def update_goal(goal):
    goal_key = goal.lower().replace("_", "")
    if goal_key == "weightloss":
        store.current_goal = "weight_loss"
    elif goal_key == "musclegain":
        store.current_goal = "muscle_gain"
    elif goal_key == "maintenance":
        store.current_goal = "maintenance"
    elif goal in GOALS:
        store.current_goal = goal
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid goal. Choose weight_loss, maintenance, or muscle_gain.",
        )

    return get_dashboard_state()
