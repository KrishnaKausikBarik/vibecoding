from pydantic import BaseModel


class GoalUpdate(BaseModel):
    goal: str
