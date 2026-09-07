from typing import Dict, Any, List

def extract_text_from_image(image_path: str = "") -> Dict[str, Any]:
    """
    Mock OCR engine returning extracted text elements, bounding boxes, and confidence scores
    conforming strictly to docs/data-contract.json schema.
    """
    # Sample Mock OCR Output adhering to data contract
    return {
        "product_id": "MOCK_PACK_001",
        "extracted_text": [
            {
                "text": "Organic Almond Milk 1L",
                "confidence": 0.98,
                "bbox": [50, 100, 350, 140]
            },
            {
                "text": "MRP ₹240.00 (Incl. of all taxes)",
                "confidence": 0.95,
                "bbox": [50, 160, 380, 195]
            },
            {
                "text": "Net Quantity: 1000 ml",
                "confidence": 0.96,
                "bbox": [50, 210, 300, 240]
            },
            {
                "text": "Mfg Date: 07/2026",
                "confidence": 0.92,
                "bbox": [50, 255, 240, 285]
            },
            {
                "text": "Mfd By: Pure Organics Foods India Pvt Ltd, Mumbai",
                "confidence": 0.89,
                "bbox": [50, 300, 480, 335]
            },
            {
                "text": "Country of Origin: India",
                "confidence": 0.94,
                "bbox": [50, 350, 280, 380]
            }
            # Note: Consumer Care intentionally omitted to demonstrate POTENTIAL_VIOLATION logic
        ]
    }
