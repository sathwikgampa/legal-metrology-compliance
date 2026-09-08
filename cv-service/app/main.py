import os
import sys
import cv2
import numpy as np
from typing import Optional

# Add app directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from image_quality import assess_image_quality
from preprocessing import preprocess_package_image
from ocr import extract_text_from_image
from declaration_extractor import extract_declarations_from_ocr
from evidence import generate_evidence_data

app = FastAPI(
    title="Legal Metrology CV & OCR Service",
    description="Computer Vision, OCR, & Declaration Extraction API for Legal Metrology Officers.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "service": "Legal Metrology Computer Vision & OCR Microservice",
        "status": "online",
        "version": "1.0.0"
    }

@app.post("/ocr/extract")
async def run_ocr(
    file: Optional[UploadFile] = File(None),
    product_id: str = Form("PROD_AUDIT_001")
):
    """
    Complete Pipeline Execution:
    1. Receive uploaded package image.
    2. Assess Image Quality (Laplacian variance blur, brightness, glare ratio).
    3. Apply Image Preprocessing (Resize, CLAHE contrast, Denoise, Sharpen).
    4. Run OCR Text Extraction (Text blocks, confidence, bounding boxes).
    5. Declaration Detection & Extraction (MRP, Net Qty, Manufacturer, Consumer Care, Origin).
    6. Evidence Snippet & Overlay Generation.
    7. Return structured JSON payload conforming to Data Contract.
    """
    file_name = "sample.png"
    img_array = None

    if file and file.filename:
        file_name = file.filename
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img_array = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img_array is None:
            raise HTTPException(status_code=415, detail="Unsupported or corrupt image file.")
    else:
        # Default placeholder image generation if no file uploaded
        img_array = np.zeros((600, 800, 3), dtype=np.uint8) + 245
        cv2.putText(img_array, "Organic Almond Milk 1L", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 0), 2)
        cv2.putText(img_array, "MRP Rs 240.00 (Incl of all taxes)", (50, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
        cv2.putText(img_array, "Net Qty: 1000 ml", (50, 250), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
        cv2.putText(img_array, "Mfg Date: 07/2026", (50, 310), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
        cv2.putText(img_array, "Mfd By: Pure Organics Foods Ltd, Mumbai", (50, 370), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
        cv2.putText(img_array, "Customer Care: 1800-222-999", (50, 430), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
        cv2.putText(img_array, "Country of Origin: India", (50, 490), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)

    # 1. Quality Assessment
    quality = assess_image_quality(img_array)

    # 2. Image Preprocessing
    prep_res = preprocess_package_image(img_array)
    if not prep_res.get("success"):
        raise HTTPException(status_code=500, detail=prep_res.get("error", "Preprocessing failed"))

    original_img = prep_res["original"]
    processed_img = prep_res["processed"]
    scale_factor = prep_res.get("scale_factor", 1.0)

    # 3. OCR Text Extraction
    ocr_data = extract_text_from_image(processed_img, product_id=product_id, scale_factor=scale_factor)
    ocr_blocks = ocr_data.get("extracted_text", [])

    # 4. Declaration Detection & Extraction
    decl_res = extract_declarations_from_ocr(ocr_blocks)
    extracted_declarations = decl_res.get("fields", {})
    declaration_confidence = decl_res.get("declaration_confidence", {})

    # 5. Evidence Overlay & Snippet Generation
    evidence_res = generate_evidence_data(original_img, extracted_declarations, product_id=product_id)

    # Final Integrated Output to Person 1 Contract
    return {
        "status": "success",
        "file_name": file_name,
        "product_id": product_id,
        "image_quality": {
            "score": quality.get("score"),
            "quality_status": quality.get("status"),
            "is_acceptable": quality.get("is_acceptable"),
            "blur": quality.get("blur"),
            "glare": quality.get("glare"),
            "brightness_ok": quality.get("brightness_ok"),
            "reasons": quality.get("reasons")
        },
        "ocr_result": ocr_data,
        "extracted_declarations": extracted_declarations,
        "declaration_confidence": declaration_confidence,
        "evidence": evidence_res
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
