from fastapi import APIRouter

from app.data.goals import GOALS
from app.models.goal import GoalUpdate
from app.services.meal_service import update_goal

router = APIRouter(prefix="/api", tags=["goals"])


@router.get("/goals")
def get_goals():
    return GOALS


@router.put("/goals/current")
def update_current_goal(req: GoalUpdate):
    return update_goal(req.goal)
