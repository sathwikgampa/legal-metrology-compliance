from fastapi import APIRouter, Depends, HTTPException, Body
from pymongo.database import Database
from typing import Dict, Any, Optional
from app.database.database import get_db
from app.services.compliance_engine import evaluate_compliance
from app.services.product_parser import parse_ocr_to_product_profile
from app.services.inspection_service import create_inspection_record

router = APIRouter(prefix="", tags=["Analyze"])

@router.post("/analyze")
async def analyze_package(
    payload: Dict[str, Any] = Body(default={}),
    db: Database = Depends(get_db)
):
    """
    Analyzes raw OCR text or Product Profile payload, runs compliance rules engine,
    saves the inspection record in MongoDB, and returns evaluation.
    """
    ocr_result = payload.get("ocr_result")
    product_profile = payload.get("product_profile")
    ocr_confidence = payload.get("confidence", 0.95)

    if not product_profile and ocr_result:
        product_profile = parse_ocr_to_product_profile(ocr_result)
    elif not product_profile:
        # Default mock fallback if empty body sent
        product_profile = {
            "product_name": payload.get("product_name", "Sample Packaged Food"),
            "manufacturer": payload.get("manufacturer", "ABC Foods Pvt Ltd"),
            "packer": payload.get("packer", ""),
            "importer": payload.get("importer", ""),
            "net_quantity": payload.get("net_quantity", "500 g"),
            "mrp": payload.get("mrp", "₹150"),
            "date": payload.get("date", "06/2026"),
            "consumer_care": payload.get("consumer_care", ""),  # Empty to demonstrate violation
            "country_of_origin": payload.get("country_of_origin", "India"),
            "other_declarations": []
        }

    compliance_result = evaluate_compliance(product_profile, ocr_confidence=ocr_confidence)
    inspection_record = create_inspection_record(db, product_profile, compliance_result)

    return {
        "inspection_id": inspection_record.id,
        "product_id": inspection_record.product_id,
        "product_profile": product_profile,
        "compliance_result": compliance_result,
        "created_at": inspection_record.created_at.isoformat()
    }
