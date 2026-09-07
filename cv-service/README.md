# CV Service - Image Quality & OCR Processing

Computer Vision & Optical Character Recognition (OCR) sub-service for the Legal Metrology Compliance System.

## Features
- **Image Preprocessing**: Grayscale conversion, noise reduction, and adaptive thresholding using OpenCV & Pillow.
- **Quality Assessment**: Sharpness score calculation via Laplacian variance to evaluate image blur/lighting.
- **Mock OCR Text Extraction**: Formats bounding box and confidence metadata following `docs/data-contract.json`.

## Run Instructions

1. **Install dependencies**:
   ```bash
   pip install -r cv-service/requirements.txt
   ```

2. **Run CV Service**:
   ```bash
   uvicorn cv-service.app.main:app --reload --port 8001
   ```

3. **Test Extraction**:
   ```bash
   curl -X POST http://localhost:8001/ocr/extract
   ```
