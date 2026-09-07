from sqlalchemy.orm import Session
from backend.app.models.product import Product
from backend.app.models.inspection import Inspection
from backend.app.models.violation import Violation
from typing import Dict, Any, List, Optional

def create_inspection_record(
    db: Session,
    product_profile: Dict[str, Any],
    compliance_result: Dict[str, Any]
) -> Inspection:
    """
    Persists Product profile, Inspection record, and associated Violations into the database.
    """
    # 1. Create Product
    product = Product(
        product_name=product_profile.get("product_name", ""),
        manufacturer=product_profile.get("manufacturer", ""),
        packer=product_profile.get("packer", ""),
        importer=product_profile.get("importer", ""),
        net_quantity=product_profile.get("net_quantity", ""),
        mrp=product_profile.get("mrp", ""),
        date=product_profile.get("date", ""),
        consumer_care=product_profile.get("consumer_care", ""),
        country_of_origin=product_profile.get("country_of_origin", "")
    )
    db.add(product)
    db.flush()  # Ensures product.id is generated

    # 2. Create Inspection
    inspection = Inspection(
        product_id=product.id,
        status=compliance_result.get("status", "NEEDS_REVIEW"),
        confidence=compliance_result.get("confidence", 0.0),
        officer_decision="PENDING",
        officer_remarks=""
    )
    db.add(inspection)
    db.flush()  # Ensures inspection.id is generated

    # 3. Create Violations
    for v in compliance_result.get("violations", []):
        violation = Violation(
            inspection_id=inspection.id,
            field=v.get("field", ""),
            issue=v.get("issue", ""),
            severity=v.get("severity", "MEDIUM"),
            confidence=v.get("confidence", 0.0),
            rule_reference=v.get("rule_reference", "Legal Metrology Rules, 2011")
        )
        db.add(violation)

    db.commit()
    db.refresh(inspection)
    return inspection

def get_inspection_by_id(db: Session, inspection_id: str) -> Optional[Inspection]:
    return db.query(Inspection).filter(Inspection.id == inspection_id).first()

def update_officer_review(
    db: Session,
    inspection_id: str,
    decision: str,
    remarks: str
) -> Optional[Inspection]:
    inspection = get_inspection_by_id(db, inspection_id)
    if inspection:
        inspection.officer_decision = decision
        inspection.officer_remarks = remarks
        db.commit()
        db.refresh(inspection)
    return inspection

def get_dashboard_summary(db: Session) -> Dict[str, Any]:
    total_inspections = db.query(Inspection).count()
    compliant_count = db.query(Inspection).filter(Inspection.status == "COMPLIANT").count()
    potential_violations = db.query(Inspection).filter(Inspection.status == "POTENTIAL_VIOLATION").count()
    needs_review = db.query(Inspection).filter(Inspection.status == "NEEDS_REVIEW").count()
    pending_reviews = db.query(Inspection).filter(Inspection.officer_decision == "PENDING").count()

    recent_inspections = db.query(Inspection).order_by(Inspection.created_at.desc()).limit(10).all()

    recent_data = []
    for ins in recent_inspections:
        recent_data.append({
            "id": ins.id,
            "product_name": ins.product.product_name if ins.product else "Unknown Product",
            "status": ins.status,
            "confidence": ins.confidence,
            "officer_decision": ins.officer_decision,
            "created_at": ins.created_at.isoformat() if ins.created_at else ""
        })

    return {
        "metrics": {
            "total_inspections": total_inspections,
            "compliant": compliant_count,
            "potential_violations": potential_violations,
            "needs_review": needs_review,
            "pending_officer_review": pending_reviews
        },
        "recent_inspections": recent_data
    }
