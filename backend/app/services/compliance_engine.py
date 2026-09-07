import json
import os
from typing import Dict, Any, List

RULES_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "rules", "packaged_commodities.json")

def load_rules() -> Dict[str, Any]:
    if os.path.exists(RULES_FILE):
        with open(RULES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"required_declarations": ["product_name", "manufacturer", "net_quantity", "mrp", "date", "consumer_care"]}

def evaluate_compliance(product_profile: Dict[str, Any], ocr_confidence: float = 0.9) -> Dict[str, Any]:
    """
    Evaluates product profile against Legal Metrology (Packaged Commodities) Rules, 2011.
    Implements core principle: 'Not detected' must NOT automatically mean 'not present'.
    Uncertain OCR results yield NEEDS_REVIEW or POTENTIAL_VIOLATION depending on evidence.
    """
    rules = load_rules()
    required_fields: List[str] = rules.get("required_declarations", [])

    violations: List[Dict[str, Any]] = []
    missing_fields: List[str] = []
    present_fields: List[str] = []

    # Map human friendly rule references
    rule_map = {
        "product_name": "Rule 6(1)(a) - Name/Description of Commodity",
        "manufacturer": "Rule 6(1)(b) - Name & Address of Manufacturer/Packer/Importer",
        "net_quantity": "Rule 6(1)(c) - Net Quantity Declaration",
        "mrp": "Rule 6(1)(e) - Maximum Retail Price (MRP inclusive of all taxes)",
        "date": "Rule 6(1)(d) - Month & Year of Manufacture/Pre-packing",
        "consumer_care": "Rule 6(1)(ac) - Consumer Care Details (Email/Phone/Address)"
    }

    for field in required_fields:
        val = str(product_profile.get(field, "") or "").strip()
        if not val:
            missing_fields.append(field)
            severity = "HIGH" if field in ["consumer_care", "mrp", "net_quantity"] else "MEDIUM"
            violations.append({
                "field": field,
                "issue": f"Mandatory declaration '{field.replace('_', ' ').title()}' is not detected on packaging.",
                "severity": severity,
                "confidence": round(ocr_confidence, 2),
                "rule_reference": rule_map.get(field, "Legal Metrology Rules, 2011 - Mandatory Declarations")
            })
        else:
            present_fields.append(field)

    # Determine compliance status
    if ocr_confidence < 0.6:
        # Low OCR confidence -> Needs Review regardless of field detection
        status = "NEEDS_REVIEW"
        overall_confidence = round(ocr_confidence, 2)
    elif not missing_fields:
        # All required declarations present
        status = "COMPLIANT"
        overall_confidence = round(ocr_confidence, 2)
    elif len(missing_fields) >= 2 or "consumer_care" in missing_fields or "mrp" in missing_fields:
        # Critical mandatory declarations missing
        status = "POTENTIAL_VIOLATION"
        overall_confidence = round(ocr_confidence * 0.9, 2)
    else:
        # Single non-critical missing field or uncertain extraction
        status = "NEEDS_REVIEW"
        overall_confidence = round(ocr_confidence * 0.8, 2)

    return {
        "status": status,
        "confidence": overall_confidence,
        "violations": violations
    }
