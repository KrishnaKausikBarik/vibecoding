from fastapi import APIRouter

from app.services.meal_service import get_dashboard_state

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/dashboard")
def get_dashboard():
    return get_dashboard_state()
