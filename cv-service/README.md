# Legal Metrology Compliance System — Person 2: Computer Vision & OCR Subsystem

## Overview
This directory contains the complete **Computer Vision (CV) & Optical Character Recognition (OCR) Microservice** (Person 2 Component) built for the Legal Metrology Compliance Audit System using **Python, OpenCV, PaddleOCR, EasyOCR, Pillow, NumPy, PyYAML, and FastAPI**.

It automates image reception, quality assessment, preprocessing, text detection & recognition, legal declaration pattern matching, confidence scoring, evidence region cropping, visual overlay generation, and FastAPI backend integration.

---

## 🌟 Feature Breakdown (Phases 1 to 12)

### 1. AI / CV Environment & Multi-Engine Setup
* Installed OpenCV, PaddleOCR, EasyOCR, Pillow, NumPy, PyYAML, FastAPI, and Uvicorn in [`requirements.txt`](file:///v:/legal-metrology-compliance/cv-service/requirements.txt).
* Multi-tier lazy OCR loader in [`app/ocr.py`](file:///v:/legal-metrology-compliance/cv-service/app/ocr.py) with fallback hierarchy:
  `PaddleOCR` ──(fallback)──► `EasyOCR` ──(fallback)──► `Heuristic Fallback Engine`

### 2. Image Input Pipeline
* Multi-format decoding via OpenCV (`cv2.imdecode`) in [`app/main.py`](file:///v:/legal-metrology-compliance/cv-service/app/main.py) and [`app/preprocessing.py`](file:///v:/legal-metrology-compliance/cv-service/app/preprocessing.py).
* Accepts `.jpg`, `.jpeg`, `.png`, `.bmp`, `.webp`, Base64 strings, and raw binary streams (`UploadFile`).
* Multi-resolution support handling images from 400px up to 4K resolution.

### 3. Image Quality Checking
* Quality evaluation in [`app/image_quality.py`](file:///v:/legal-metrology-compliance/cv-service/app/image_quality.py):
  - **Blur Detection**: Laplacian variance (`cv2.Laplacian(gray, cv2.CV_64F).var() < 100.0` flags blur).
  - **Brightness Check**: Mean pixel intensity (`mean < 40.0` underexposed, `mean > 220.0` overexposed).
  - **Glare Detection**: Overexposed pixel mask (`gray > 240`, `ratio > 0.15` flags severe glare).
  - **Composite Score & Status**: Score $= 0.50 \times \text{Sharpness} + 0.25 \times \text{Brightness} + 0.25 \times \text{Glare}$ returning `GOOD`, `WARNING`, or `RETAKE`.

### 4. Image Preprocessing
* Filtering pipeline in [`app/preprocessing.py`](file:///v:/legal-metrology-compliance/cv-service/app/preprocessing.py):
  - Preserves pristine raw BGR `original` array for evidence records.
  - Scales down oversized images to max dimension 1600px while computing exact `scale_factor`.
  - Applies Grayscale conversion, CLAHE contrast enhancement (`clipLimit=2.5`), Bilateral noise reduction (`d=9, sigmaColor=75, sigmaSpace=75`), and 2D Sharpening convolution.

### 5 & 6. OCR Extraction & Text Cleaning
* Text recognition in [`app/ocr.py`](file:///v:/legal-metrology-compliance/cv-service/app/ocr.py):
  - Extracts text blocks, confidence scores, and bounding polygon vertices.
  - Rescales coordinates back to original unscaled dimensions using $1.0 / \text{scale\_factor}$.
  - Normalizes text formatting while preserving raw OCR outputs for audit trace.

### 7 & 8. Declaration Extraction & Confidence Review
* Configurable rules in [`app/declaration_extractor.py`](file:///v:/legal-metrology-compliance/cv-service/app/declaration_extractor.py) and [`app/rules/field_patterns.yaml`](file:///v:/legal-metrology-compliance/cv-service/app/rules/field_patterns.yaml):
  - Mandatory declarations: `MRP`, `NET_QUANTITY`, `MANUFACTURER`, `CONSUMER_CARE`, `COUNTRY_OF_ORIGIN`, and `MFG_DATE`.
  - Regex priority matching and canonical value normalization (e.g., `"240.00 INR"`, `"1000 ml"`, `"500 g"`).
  - Assigns confidence levels: `HIGH` ($\ge 0.85$), `MEDIUM` ($0.70 - 0.85$), `LOW` ($< 0.70$), or `NONE`.
  - Sets `requires_review = True` for low-confidence or missing fields to trigger human officer review instead of automatic failure.

### 9. Evidence Generation
* Visual evidence in [`app/evidence.py`](file:///v:/legal-metrology-compliance/cv-service/app/evidence.py):
  - Color-coded bounding box overlays on full frame (🟢 Green for HIGH, 🟡 Amber for MEDIUM, 🔴 Red for LOW, 🩶 Grey for NONE).
  - Crops region-of-interest (ROI) declaration snippets with a +10px margin buffer and encodes as Base64 Data URLs.

### 10. Backend Integration
* FastAPI web service in [`app/main.py`](file:///v:/legal-metrology-compliance/cv-service/app/main.py):
  - Exposes RESTful endpoint `POST /ocr/extract` with CORS middleware enabling backend integration and MongoDB persistence.

### 11. Synthetic Test Dataset & Verification
* Synthetic test image generator [`generate_test_images.py`](file:///v:/legal-metrology-compliance/generate_test_images.py) creates compliant food/detergent packaging, missing helpline violations, missing origin violations, blurry photos, and glared photos under `test_data/`.
* Automated test suite [`app/test_cv_pipeline.py`](file:///v:/legal-metrology-compliance/cv-service/app/test_cv_pipeline.py) verifies end-to-end processing.

### 12. Final Data Contract Output to Person 1
* Output structure conforms strictly to [`docs/data-contract.json`](file:///v:/legal-metrology-compliance/docs/data-contract.json).

---

## 📁 File Structure

```
cv-service/
├── README.md                          # Service overview & feature quickstart
├── DOCUMENTATION.md                   # Full technical specification & walkthrough
├── requirements.txt                   # Microservice dependencies
└── app/
    ├── __init__.py
    ├── main.py                        # FastAPI entry point & API endpoints
    ├── image_quality.py               # Blur, brightness, and glare assessment
    ├── preprocessing.py               # Image scaling, CLAHE, Denoise, Sharpen
    ├── ocr.py                         # Multi-engine OCR text extraction
    ├── declaration_extractor.py       # Pattern matching & normalization
    ├── evidence.py                    # Bounding overlays & Base64 crops
    ├── test_cv_pipeline.py            # Automated pipeline test suite
    └── rules/
        └── field_patterns.yaml        # Regex pattern definitions
```

---

## ⚡ Execution Instructions

### 1. Run Automated Test Suite
```bash
python cv-service/app/test_cv_pipeline.py
```

### 2. Launch FastAPI Microservice
```bash
python cv-service/app/main.py
```
Or with uvicorn CLI:
```bash
uvicorn cv-service.app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Send Test OCR Request
```bash
curl -X POST "http://localhost:8001/ocr/extract" -F "product_id=PROD_001"
```
