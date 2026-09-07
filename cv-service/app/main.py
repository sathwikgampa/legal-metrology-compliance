import os
import sys

# Add app directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, UploadFile, File
from image_quality import assess_image_quality
from preprocessing import preprocess_package_image
from ocr import extract_text_from_image

app = FastAPI(
    title="Legal Metrology CV Service",
    description="Computer Vision & OCR Service for Packaging Inspection",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"service": "CV Service", "status": "running"}

@app.post("/ocr/extract")
async def run_ocr(file: UploadFile = File(None)):
    """
    Runs image quality check, preprocessing, and OCR text extraction.
    Returns JSON formatted according to docs/data-contract.json.
    """
    file_name = file.filename if file else "sample.png"

    # 1. Quality check placeholder
    quality_res = assess_image_quality(file_name)

    # 2. Extract OCR text
    ocr_res = extract_text_from_image(file_name)

    return {
        "status": "success",
        "file_name": file_name,
        "quality_assessment": quality_res,
        "ocr_result": ocr_res
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
