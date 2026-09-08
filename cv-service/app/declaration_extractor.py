import os
import re
import yaml
from typing import Dict, Any, List, Optional

DEFAULT_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "rules", "field_patterns.yaml")

def load_field_patterns(config_path: str = DEFAULT_CONFIG_PATH) -> List[Dict[str, Any]]:
    """
    Loads field regex patterns and normalization rules from YAML configuration.
    """
    if os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
            return data.get("fields", [])
    
    # Built-in fallback if file missing
    return [
        {
            "id": "MRP",
            "name": "Maximum Retail Price",
            "patterns": [r'(?i)(?:mrp|max(?:imum)?\s*retail\s*price)\s*[:\-]?\s*(?:rs\.?|₹|inr)?\s*(\d+(?:\.\d{1,2})?)', r'(?i)(?:rs\.?|₹|inr)\s*(\d+(?:\.\d{1,2})?)'],
            "normalize": "currency"
        },
        {
            "id": "NET_QUANTITY",
            "name": "Net Quantity",
            "patterns": [r'(?i)(?:net\s*(?:qty|quantity|wt|weight|vol|volume)?)\s*[:\-]?\s*(\d+(?:\.\d+)?\s*(?:g|kg|gm|gms|ml|l|ltr|litres|liter|n|pcs|pieces|units))\b', r'(?i)\b(\d+(?:\.\d+)?\s*(?:g|kg|gm|gms|ml|l|ltr|litres|liter|pcs))\b'],
            "normalize": "weight_volume"
        },
        {
            "id": "MANUFACTURER",
            "name": "Manufacturer / Packer",
            "patterns": [r'(?i)(?:mfd\.?\s*by|manufactured\s*by|packed\s*by|mktd\.?\s*by|marketed\s*by|produced\s*by|mfg\s*by)\s*[:\-]?\s*(.+)', r'(?i)(?:packer|manufacturer)\s*[:\-]?\s*(.+)'],
            "normalize": "text"
        },
        {
            "id": "CONSUMER_CARE",
            "name": "Consumer Care Details",
            "patterns": [r'(?i)(?:consumer\s*care|customer\s*care|care\s*cell|helpline|toll\s*free)\s*[:\-]?\s*(.+)', r'(?i)(?:email|contact|phone)\s*[:\-]?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\d{3,}[-\s]?\d{3,}[-\s]?\d{3,})'],
            "normalize": "text"
        },
        {
            "id": "COUNTRY_OF_ORIGIN",
            "name": "Country of Origin",
            "patterns": [r'(?i)(?:country\s*of\s*origin|made\s*in|product\s*of)\s*[:\-]?\s*([a-zA-Z\s]+)'],
            "normalize": "text"
        }
    ]

def normalize_field_value(raw_val: str, norm_type: str) -> str:
    """
    Normalizes extracted raw field values into standard canonical representations.
    """
    if not raw_val:
        return ""
    
    cleaned = raw_val.strip()

    if norm_type == "currency":
        match = re.search(r'\d+(?:\.\d{1,2})?', cleaned)
        if match:
            return f"{match.group(0)} INR"
        return cleaned

    elif norm_type == "weight_volume":
        match = re.search(r'(\d+(?:\.\d+)?)\s*([a-zA-Z]+)', cleaned)
        if match:
            num, unit = match.group(1), match.group(2).lower()
            if unit in ["gm", "gms", "g"]:
                unit = "g"
            elif unit in ["kg", "kgs"]:
                unit = "kg"
            elif unit in ["ml", "mls"]:
                unit = "ml"
            elif unit in ["l", "ltr", "litres", "liter"]:
                unit = "l"
            return f"{num} {unit}"
        return cleaned

    return cleaned

def extract_declarations_from_ocr(
    ocr_blocks: List[Dict[str, Any]],
    config_path: str = DEFAULT_CONFIG_PATH
) -> Dict[str, Any]:
    """
    Processes OCR text blocks and returns extracted declaration fields.
    Evaluates patterns in priority order: higher priority regex matches take precedence.
    """
    fields_config = load_field_patterns(config_path)
    extracted_fields: Dict[str, Any] = {}
    declaration_confidence: Dict[str, str] = {}

    for field in fields_config:
        field_id = field["id"]
        field_name = field.get("name", field_id)
        patterns = field.get("patterns", [])
        norm_type = field.get("normalize", "text")

        best_match: Optional[Dict[str, Any]] = None

        # Iterate over patterns in priority order
        for pattern in patterns:
            highest_conf = -1.0
            pattern_match: Optional[Dict[str, Any]] = None

            for block in ocr_blocks:
                text = block.get("text", "")
                conf = float(block.get("confidence", 0.0))
                bbox = block.get("bbox", [0, 0, 0, 0])

                match = re.search(pattern, text)
                if match:
                    val = match.group(1) if match.groups() else text
                    if conf > highest_conf:
                        highest_conf = conf
                        normalized = normalize_field_value(val, norm_type)
                        pattern_match = {
                            "field_id": field_id,
                            "field_name": field_name,
                            "raw": text,
                            "value": normalized,
                            "confidence": round(conf, 2),
                            "bbox": bbox
                        }

            if pattern_match:
                best_match = pattern_match
                break  # Priority pattern matched, stop trying lower priority fallbacks

        if best_match:
            conf_val = best_match["confidence"]
            if conf_val >= 0.85:
                level = "HIGH"
            elif conf_val >= 0.70:
                level = "MEDIUM"
            else:
                level = "LOW"

            best_match["confidence_level"] = level
            best_match["requires_review"] = (level == "LOW" or conf_val < 0.75)
            extracted_fields[field_id] = best_match
            declaration_confidence[field_id] = level
        else:
            extracted_fields[field_id] = {
                "field_id": field_id,
                "field_name": field_name,
                "raw": None,
                "value": None,
                "confidence": 0.0,
                "confidence_level": "NONE",
                "requires_review": True,
                "bbox": None
            }
            declaration_confidence[field_id] = "NONE"

    return {
        "fields": extracted_fields,
        "declaration_confidence": declaration_confidence
    }
