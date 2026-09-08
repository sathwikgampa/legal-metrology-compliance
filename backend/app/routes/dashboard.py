from fastapi import APIRouter, Depends
from pymongo.database import Database
from app.database.database import get_db
from app.services.inspection_service import get_dashboard_summary

router = APIRouter(prefix="", tags=["Dashboard"])

@router.get("/dashboard")
async def get_dashboard(db: Database = Depends(get_db)):
    """
    Returns aggregated metrics for Legal Metrology Officer compliance dashboard.
    """
    summary = get_dashboard_summary(db)
    return summary
