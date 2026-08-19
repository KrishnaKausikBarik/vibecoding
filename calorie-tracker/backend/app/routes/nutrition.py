from fastapi import APIRouter, HTTPException

from app.data.food_database import FOOD_DATABASE
from app.models.meal import CalculateRequest
from app.services.nutrition_service import calculate_nutrition

router = APIRouter(prefix="/api", tags=["nutrition"])


@router.get("/foods")
def get_foods():
    return {"foods": list(FOOD_DATABASE.values())}


@router.get("/foods/{food_name}")
def get_food(food_name: str):
    search_name = food_name.lower().strip()
    for key, val in FOOD_DATABASE.items():
        if val["name"].lower() == search_name or key == search_name:
            return val
    raise HTTPException(status_code=404, detail=f"Food '{food_name}' not found.")


@router.post("/nutrition/calculate")
def calculate_nutrition_endpoint(req: CalculateRequest):
    result = calculate_nutrition(req.food_name, req.portion_grams)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Food '{req.food_name}' was not found in the nutrition database.",
        )
    return result
