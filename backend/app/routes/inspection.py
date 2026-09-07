from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any
from backend.app.database.database import get_db
from backend.app.services.inspection_service import get_inspection_by_id, update_officer_review

router = APIRouter(prefix="", tags=["Inspection & Officer Review"])

@router.get("/inspection/{inspection_id}")
async def get_inspection(inspection_id: str, db: Session = Depends(get_db)):
    """
    Retrieves details for a specific inspection, including product declarations and violations.
    """
    inspection = get_inspection_by_id(db, inspection_id)
    if not inspection:
        raise HTTPException(status_code=404, detail=f"Inspection with ID {inspection_id} not found.")

    violations = []
    for v in inspection.violations:
        violations.append({
            "id": v.id,
            "field": v.field,
            "issue": v.issue,
            "severity": v.severity,
            "confidence": v.confidence,
            "rule_reference": v.rule_reference
        })

    product_data = {}
    if inspection.product:
        p = inspection.product
        product_data = {
            "id": p.id,
            "product_name": p.product_name,
            "manufacturer": p.manufacturer,
            "packer": p.packer,
            "importer": p.importer,
            "net_quantity": p.net_quantity,
            "mrp": p.mrp,
            "date": p.date,
            "consumer_care": p.consumer_care,
            "country_of_origin": p.country_of_origin
        }

    return {
        "inspection_id": inspection.id,
        "status": inspection.status,
        "confidence": inspection.confidence,
        "officer_decision": inspection.officer_decision,
        "officer_remarks": inspection.officer_remarks,
        "created_at": inspection.created_at.isoformat() if inspection.created_at else "",
        "product_profile": product_data,
        "violations": violations
    }

@router.post("/officer-review")
async def record_officer_review(
    payload: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Records human Legal Metrology Officer review decision and comments.
    Enforces principle: Officer decision is the final authority.
    """
    inspection_id = payload.get("inspection_id")
    decision = payload.get("decision", "APPROVED")  # APPROVED, REJECTED, FLAGGED
    remarks = payload.get("remarks", "")

    if not inspection_id:
        raise HTTPException(status_code=400, detail="Missing required field 'inspection_id'")

    updated = update_officer_review(db, inspection_id, decision, remarks)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Inspection '{inspection_id}' not found")

    return {
        "message": "Officer review recorded successfully",
        "inspection_id": updated.id,
        "status": updated.status,
        "officer_decision": updated.officer_decision,
        "officer_remarks": updated.officer_remarks
    }
