from fastapi import APIRouter

from app.models.meal import MealCreate
from app.services.meal_service import add_meal, delete_meal, get_meals_state

router = APIRouter(prefix="/api", tags=["meals"])


@router.post("/meals")
def create_meal(req: MealCreate):
    return add_meal(req.food_name, req.portion_grams)


@router.get("/meals")
def get_meals():
    return get_meals_state()


@router.delete("/meals/{meal_id}")
def remove_meal(meal_id: int):
    return delete_meal(meal_id)
