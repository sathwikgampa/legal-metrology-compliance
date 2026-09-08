# Legal Metrology Compliance System — Person 2: Computer Vision & OCR Technical Specification & Walkthrough

## Executive Summary
This document details the architecture, implementation, and verification walkthrough for the **Computer Vision (CV) & Optical Character Recognition (OCR) Microservice** (Person 2 Component) in the Legal Metrology Compliance System.

---

## 🏗 Subsystem Architecture & Execution Flow

```
                      [ Packaging Image Upload ]
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ 1. Input Validation   │ (OpenCV imdecode / Base64 / File)
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ 2. Quality Assessment │ (Laplacian Blur, Brightness, Glare)
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ 3. Preprocessing      │ (CLAHE, Bilateral Denoise, Sharpen)
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ 4. Multi-Engine OCR   │ (PaddleOCR -> EasyOCR -> Heuristic)
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ 5. Declaration Engine │ (Regex Matching via field_patterns.yaml)
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ 6. Evidence Generator │ (Annotated Overlay & Base64 Crops)
                     └───────────┬───────────┘
                                 │
                                 ▼
                     [ FastAPI JSON Endpoint ] ───► MongoDB / Person 1 Compliance Engine
```

---

## 🛠 Detailed Walkthrough by Feature Phase

### Phase 1: Set Up AI/CV Environment
- **File**: [`requirements.txt`](file:///v:/legal-metrology-compliance/cv-service/requirements.txt)
- **Engine Setup**: Implemented lazy initialization in [`app/ocr.py`](file:///v:/legal-metrology-compliance/cv-service/app/ocr.py) (`get_ocr_engine()`) supporting PaddleOCR, EasyOCR, and a fallback engine for high availability.

### Phase 2: Build Image Input Pipeline
- **Files**: [`app/main.py`](file:///v:/legal-metrology-compliance/cv-service/app/main.py), [`app/preprocessing.py`](file:///v:/legal-metrology-compliance/cv-service/app/preprocessing.py)
- Handles incoming images from HTTP POST multipart form data (`file`), Base64 input strings, or disk paths. Converts streams into OpenCV matrix arrays (`cv2.imdecode`).

### Phase 3: Image Quality Checking
- **File**: [`app/image_quality.py`](file:///v:/legal-metrology-compliance/cv-service/app/image_quality.py) -> `assess_image_quality()`
- Calculates Laplacian variance for blur detection, mean grayscale intensity for illumination, and overexposed pixel ratios for glare. Produces a composite score and categorizes status into `GOOD`, `WARNING`, or `RETAKE`.

### Phase 4: Image Preprocessing
- **File**: [`app/preprocessing.py`](file:///v:/legal-metrology-compliance/cv-service/app/preprocessing.py) -> `preprocess_package_image()`
- Preserves raw original image array, rescales high-res photos to max dimension 1600px, converts to grayscale, applies CLAHE contrast enhancement, bilateral denoising, and a 2D sharpening kernel.

### Phase 5 & 6: OCR Pipeline & Text Result Cleaning
- **File**: [`app/ocr.py`](file:///v:/legal-metrology-compliance/cv-service/app/ocr.py) -> `extract_text_from_image()`, `clean_ocr_text()`
- Runs text detection and recognition, rescales bounding box coordinates back to original unscaled pixel dimensions, cleans whitespace, and returns structured JSON output.

### Phase 7 & 8: Declaration Detection & Confidence Review
- **Files**: [`app/declaration_extractor.py`](file:///v:/legal-metrology-compliance/cv-service/app/declaration_extractor.py), [`app/rules/field_patterns.yaml`](file:///v:/legal-metrology-compliance/cv-service/app/rules/field_patterns.yaml)
- Evaluates regex patterns against mandatory package declarations (`MRP`, `NET_QUANTITY`, `MANUFACTURER`, `CONSUMER_CARE`, `COUNTRY_OF_ORIGIN`, `MFG_DATE`), normalizes values, maps confidence levels (`HIGH`/`MEDIUM`/`LOW`/`NONE`), and sets `requires_review = True` for low-confidence detections.

### Phase 9: Evidence Generation
- **File**: [`app/evidence.py`](file:///v:/legal-metrology-compliance/cv-service/app/evidence.py) -> `generate_evidence_data()`
- Draws color-coded bounding box overlays on full frame images (Green/Amber/Red/Grey) and crops padded region-of-interest (ROI) declaration snippets as Base64 Data URLs.

### Phase 10: Backend Integration
- **File**: [`app/main.py`](file:///v:/legal-metrology-compliance/cv-service/app/main.py)
- Exposes `POST /ocr/extract` route in FastAPI, wiring together all processing stages into a single JSON payload response compatible with MongoDB and Person 1's backend.

### Phase 11: Test Dataset & Automated Pipeline Test Suite
- **Files**: [`generate_test_images.py`](file:///v:/legal-metrology-compliance/generate_test_images.py), [`app/test_cv_pipeline.py`](file:///v:/legal-metrology-compliance/cv-service/app/test_cv_pipeline.py)
- Generates 6 test packaging images (compliant food/detergent, missing consumer care, missing country of origin, blurry, glared) and executes end-to-end verification.

### Phase 12: Final Output to Person 1
- Returns structured JSON payload complying strictly with [`docs/data-contract.json`](file:///v:/legal-metrology-compliance/docs/data-contract.json).

---

## ⚡ Execution Commands

Run test suite:
```bash
python cv-service/app/test_cv_pipeline.py
```

Run FastAPI server:
```bash
python cv-service/app/main.py
```
