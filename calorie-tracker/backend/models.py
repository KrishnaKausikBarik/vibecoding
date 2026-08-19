from pydantic import BaseModel, Field

class MealCreate(BaseModel):
    food_name: str
    portion_grams: float = Field(..., gt=0)

class GoalUpdate(BaseModel):
    goal: str

class CalculateRequest(BaseModel):
    food_name: str
    portion_grams: float = Field(..., gt=0)
