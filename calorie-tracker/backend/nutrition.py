from mock_data import FOOD_DATABASE

def calculate_nutrition(food_name: str, portion_grams: float):
    db_item = None
    search_name = food_name.lower().strip()
    
    for key, val in FOOD_DATABASE.items():
        if val["name"].lower() == search_name or key == search_name:
            db_item = val
            break
            
    if not db_item:
        return None
        
    multiplier = portion_grams / 100.0
    return {
        "food_name": db_item["name"],
        "portion_grams": portion_grams,
        "calories": round(db_item["calories"] * multiplier, 1),
        "protein": round(db_item["protein"] * multiplier, 1),
        "carbs": round(db_item["carbs"] * multiplier, 1),
        "fat": round(db_item["fat"] * multiplier, 1)
    }
