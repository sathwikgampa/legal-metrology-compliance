import cv2
import base64
import numpy as np
from typing import Dict, Any, Union, Optional

def image_to_base64(img_array: np.ndarray, format_ext: str = ".jpg") -> str:
    """
    Encodes an OpenCV BGR image array into a base64 Data URL string.
    """
    try:
        success, encoded_img = cv2.imencode(format_ext, img_array)
        if success:
            b64_str = base64.b64encode(encoded_img).decode("utf-8")
            mime_type = "image/jpeg" if format_ext in [".jpg", ".jpeg"] else "image/png"
            return f"data:{mime_type};base64,{b64_str}"
    except Exception:
        pass
    return ""

def generate_evidence_data(
    image_input: Union[str, np.ndarray],
    extracted_fields: Dict[str, Any],
    product_id: str = "IMG_AUDIT_001"
) -> Dict[str, Any]:
    """
    Draws bounding box annotations on packaging image and generates cropped evidence snippets
    for each detected declaration.
    """
    try:
        if isinstance(image_input, str):
            image = cv2.imread(image_input)
        elif isinstance(image_input, np.ndarray):
            image = image_input.copy()
        else:
            image = None

        if image is None:
            return {"status": "error", "message": "Invalid image input"}

        annotated_image = image.copy()
        h, w = image.shape[:2]

        evidence_records: Dict[str, Any] = {}

        # Color mapping for confidence levels (BGR)
        color_map = {
            "HIGH": (0, 200, 80),      # Green
            "MEDIUM": (0, 180, 255),   # Yellow / Amber
            "LOW": (0, 0, 220),        # Red
            "NONE": (120, 120, 120)    # Grey
        }

        for field_id, data in extracted_fields.items():
            bbox = data.get("bbox")
            conf_level = data.get("confidence_level", "NONE")
            color = color_map.get(conf_level, (120, 120, 120))
            snippet_b64 = ""

            if bbox and len(bbox) == 4 and sum(bbox) > 0:
                x1, y1, x2, y2 = bbox
                # Ensure coordinates are within image boundaries
                x1_c, y1_c = max(0, x1), max(0, y1)
                x2_c, y2_c = min(w, x2), min(h, y2)

                # Draw bounding rectangle on annotated image
                cv2.rectangle(annotated_image, (x1_c, y1_c), (x2_c, y2_c), color, 2)
                
                # Draw field label tag
                label = f"{field_id}: {conf_level}"
                cv2.putText(annotated_image, label, (x1_c, max(15, y1_c - 5)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1, cv2.LINE_AA)

                # Crop evidence region with padding
                pad = 10
                crop_x1, crop_y1 = max(0, x1_c - pad), max(0, y1_c - pad)
                crop_x2, crop_y2 = min(w, x2_c + pad), min(h, y2_c + pad)

                cropped = image[crop_y1:crop_y2, crop_x1:crop_x2]
                if cropped.size > 0:
                    snippet_b64 = image_to_base64(cropped)

            evidence_records[field_id] = {
                "product_id": product_id,
                "bbox": bbox,
                "extracted_text": data.get("raw"),
                "value": data.get("value"),
                "confidence": data.get("confidence", 0.0),
                "confidence_level": conf_level,
                "requires_review": data.get("requires_review", True),
                "snippet_b64": snippet_b64
            }

        full_annotated_b64 = image_to_base64(annotated_image)

        return {
            "status": "success",
            "evidence_records": evidence_records,
            "annotated_image_b64": full_annotated_b64
        }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to generate evidence: {str(e)}"
        }
