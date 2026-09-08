from datetime import datetime
from typing import Any, Dict, Optional
from uuid import uuid4

from pymongo.database import Database

from app.models.inspection import Inspection
from app.models.product import Product
from app.models.violation import Violation

def _product_from_document(document: Optional[Dict[str, Any]]) -> Optional[Product]:
    if not document:
        return None
    return Product(
        id=document["id"],
        product_name=document.get("product_name", ""),
        manufacturer=document.get("manufacturer", ""),
        packer=document.get("packer", ""),
        importer=document.get("importer", ""),
        net_quantity=document.get("net_quantity", ""),
        mrp=document.get("mrp", ""),
        date=document.get("date", ""),
        consumer_care=document.get("consumer_care", ""),
        country_of_origin=document.get("country_of_origin", ""),
    )


def _violation_from_document(document: Dict[str, Any]) -> Violation:
    return Violation(
        id=document["id"],
        inspection_id=document["inspection_id"],
        field=document.get("field", ""),
        issue=document.get("issue", ""),
        severity=document.get("severity", "MEDIUM"),
        confidence=document.get("confidence", 0.0),
        rule_reference=document.get("rule_reference", "Legal Metrology Rules, 2011"),
    )


def _inspection_from_document(
    document: Optional[Dict[str, Any]],
    db: Database,
) -> Optional[Inspection]:
    if not document:
        return None
    inspection_id = document["id"]
    product = _product_from_document(
        db.products.find_one({"id": document["product_id"]}, {"_id": 0})
    )
    violations = [
        _violation_from_document(item)
        for item in db.violations.find({"inspection_id": inspection_id}, {"_id": 0})
    ]
    return Inspection(
        id=inspection_id,
        product_id=document["product_id"],
        status=document.get("status", "NEEDS_REVIEW"),
        confidence=document.get("confidence", 0.0),
        officer_decision=document.get("officer_decision", "PENDING"),
        officer_remarks=document.get("officer_remarks", ""),
        created_at=document.get("created_at", datetime.utcnow()),
        product=product,
        violations=violations,
    )


def create_inspection_record(
    db: Database,
    product_profile: Dict[str, Any],
    compliance_result: Dict[str, Any],
) -> Inspection:
    """Persist a product, inspection, and violations as MongoDB documents."""
    product_id = str(uuid4())
    inspection_id = str(uuid4())
    created_at = datetime.utcnow()

    product_document = {
        "_id": product_id,
        "id": product_id,
        "product_name": product_profile.get("product_name", ""),
        "manufacturer": product_profile.get("manufacturer", ""),
        "packer": product_profile.get("packer", ""),
        "importer": product_profile.get("importer", ""),
        "net_quantity": product_profile.get("net_quantity", ""),
        "mrp": product_profile.get("mrp", ""),
        "date": product_profile.get("date", ""),
        "consumer_care": product_profile.get("consumer_care", ""),
        "country_of_origin": product_profile.get("country_of_origin", ""),
    }
    inspection_document = {
        "_id": inspection_id,
        "id": inspection_id,
        "product_id": product_id,
        "status": compliance_result.get("status", "NEEDS_REVIEW"),
        "confidence": compliance_result.get("confidence", 0.0),
        "officer_decision": "PENDING",
        "officer_remarks": "",
        "created_at": created_at,
    }

    db.products.insert_one(product_document)
    db.inspections.insert_one(inspection_document)

    violation_documents = []
    for violation in compliance_result.get("violations", []):
        violation_id = str(uuid4())
        violation_documents.append({
            "_id": violation_id,
            "id": violation_id,
            "inspection_id": inspection_id,
            "field": violation.get("field", ""),
            "issue": violation.get("issue", ""),
            "severity": violation.get("severity", "MEDIUM"),
            "confidence": violation.get("confidence", 0.0),
            "rule_reference": violation.get("rule_reference", "Legal Metrology Rules, 2011"),
        })
    if violation_documents:
        db.violations.insert_many(violation_documents)

    return _inspection_from_document(inspection_document, db)


def get_inspection_by_id(db: Database, inspection_id: str) -> Optional[Inspection]:
    document = db.inspections.find_one({"id": inspection_id}, {"_id": 0})
    return _inspection_from_document(document, db)


def update_officer_review(
    db: Database,
    inspection_id: str,
    decision: str,
    remarks: str,
) -> Optional[Inspection]:
    result = db.inspections.update_one(
        {"id": inspection_id},
        {"$set": {"officer_decision": decision, "officer_remarks": remarks}},
    )
    if result.matched_count == 0:
        return None
    return get_inspection_by_id(db, inspection_id)


def get_dashboard_summary(db: Database) -> Dict[str, Any]:
    inspections = db.inspections
    total_inspections = inspections.count_documents({})
    compliant_count = inspections.count_documents({"status": "COMPLIANT"})
    potential_violations = inspections.count_documents({"status": "POTENTIAL_VIOLATION"})
    needs_review = inspections.count_documents({"status": "NEEDS_REVIEW"})
    pending_reviews = inspections.count_documents({"officer_decision": "PENDING"})

    recent_data = []
    recent_inspections = inspections.find({}, {"_id": 0}).sort("created_at", -1).limit(10)
    for document in recent_inspections:
        product = db.products.find_one(
            {"id": document["product_id"]}, {"product_name": 1, "_id": 0}
        )
        created_at = document.get("created_at")
        recent_data.append({
            "id": document["id"],
            "product_name": product.get("product_name", "Unknown Product") if product else "Unknown Product",
            "status": document.get("status", "NEEDS_REVIEW"),
            "confidence": document.get("confidence", 0.0),
            "officer_decision": document.get("officer_decision", "PENDING"),
            "created_at": created_at.isoformat() if created_at else "",
        })

    return {
        "metrics": {
            "total_inspections": total_inspections,
            "compliant": compliant_count,
            "potential_violations": potential_violations,
            "needs_review": needs_review,
            "pending_officer_review": pending_reviews,
        },
        "recent_inspections": recent_data,
    }
