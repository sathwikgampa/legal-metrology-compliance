from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
from backend.app.services.inspection_service import get_dashboard_summary

router = APIRouter(prefix="", tags=["Dashboard"])

@router.get("/dashboard")
async def get_dashboard(db: Session = Depends(get_db)):
    """
    Returns aggregated metrics for Legal Metrology Officer compliance dashboard.
    """
    summary = get_dashboard_summary(db)
    return summary
