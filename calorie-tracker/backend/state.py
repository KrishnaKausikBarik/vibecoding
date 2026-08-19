from goals import GOALS

meals = []
current_goal = "maintenance"
next_meal_id = 1

def calculate_budget_status(total_calories, target_calories):
    remaining = target_calories - total_calories
    overage = max(0, total_calories - target_calories)
    
    if target_calories > 0:
        raw_percentage = round((total_calories / target_calories) * 100, 2)
    else:
        raw_percentage = 0
        
    if total_calories < target_calories:
        status = "within_budget"
        exceeded = False
    elif total_calories == target_calories:
        status = "budget_reached"
        exceeded = False
    else:
        status = "budget_exceeded"
        exceeded = True
        
    return {
        "remaining": remaining,
        "percentage": raw_percentage,
        "overage": overage,
        "exceeded": exceeded,
        "status": status
    }

def get_dashboard_state():
    target = GOALS[current_goal]
    
    total_cal = sum(m["calories"] for m in meals)
    total_pro = sum(m["protein"] for m in meals)
    total_carb = sum(m["carbs"] for m in meals)
    total_fat = sum(m["fat"] for m in meals)
    
    budget = calculate_budget_status(total_cal, target["calories"])
    
    macros = {
        "protein": {
            "current": round(total_pro, 1),
            "target": target["protein"],
            "percentage": round((total_pro / target["protein"]) * 100, 2) if target["protein"] else 0
        },
        "carbs": {
            "current": round(total_carb, 1),
            "target": target["carbs"],
            "percentage": round((total_carb / target["carbs"]) * 100, 2) if target["carbs"] else 0
        },
        "fat": {
            "current": round(total_fat, 1),
            "target": target["fat"],
            "percentage": round((total_fat / target["fat"]) * 100, 2) if target["fat"] else 0
        }
    }
    
    return {
        "goal_id": current_goal,
        "goal": target,
        "totals": {
            "calories": round(total_cal, 1),
            "protein": round(total_pro, 1),
            "carbs": round(total_carb, 1),
            "fat": round(total_fat, 1)
        },
        "budget": budget,
        "macros": macros,
        "meals": meals
    }
