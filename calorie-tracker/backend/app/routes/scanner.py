import random

from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["scanner"])


@router.post("/scan-food")
def scan_food():
    mocks = [
        {"food_name": "Grilled Chicken Breast", "portion_grams": 150, "calories": 247.5, "protein": 46.5, "carbs": 0.0, "fat": 5.4},
        {"food_name": "Apple", "portion_grams": 200, "calories": 104.0, "protein": 0.6, "carbs": 27.6, "fat": 0.4},
        {"food_name": "Salmon", "portion_grams": 250, "calories": 520.0, "protein": 50.0, "carbs": 0.0, "fat": 32.5},
    ]
    return random.choice(mocks)
