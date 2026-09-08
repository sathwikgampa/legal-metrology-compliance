# Legal Metrology Compliance System — Person 2: Computer Vision & OCR Subsystem Documentation

## Executive Summary
This document provides a comprehensive technical breakdown and operational walkthrough of the **Computer Vision (CV) & Optical Character Recognition (OCR) Microservice** (Person 2 Component) built for the Legal Metrology Compliance Audit System.

The service is engineered using **Python, OpenCV, PaddleOCR (with EasyOCR fallback), NumPy, PyYAML, and FastAPI**. It processes incoming packaging images, assesses photo quality, enhances readability via computer vision filtering, extracts bounding-boxed text regions, identifies mandatory legal declarations (MRP, Net Quantity, Manufacturer, Consumer Care, Country of Origin, Mfg Date) via configurable regex patterns, computes confidence scores, generates visual evidence crops, and exposes a RESTful API conforming to `docs/data-contract.json`.

---

## Technical Architecture & Pipeline Overview

```
                      [ Packaging Image Input ]
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

## Phase-by-Phase Implementation Details

### Phase 1: Set up AI/CV Environment
- **Core Dependencies**: Installed via [`requirements.txt`](file:///v:/legal-metrology-compliance/cv-service/requirements.txt):
  - `opencv-python>=4.8.0` — Image decoding, matrix manipulation, blur/glare detection, CLAHE, bilateral filtering, overlay drawing.
  - `paddleocr>=2.7.0` & `easyocr>=1.7.0` — Deep learning multi-language text detection and recognition engine.
  - `pillow>=10.0.0` & `numpy>=1.24.0` — Image rendering and high-performance array transformations.
  - `fastapi>=0.100.0` & `uvicorn>=0.22.0` — High-speed async web microservice.
  - `pyyaml>=6.0.0` — Parsing pattern configuration rules.
- **Engine Resilience**: Implemented a multi-tier lazy loader (`get_ocr_engine()` in [`ocr.py`](file:///v:/legal-metrology-compliance/cv-service/app/ocr.py)):
  1. Primary: PaddleOCR (`use_angle_cls=True, lang='en'`)
  2. Secondary: EasyOCR (`Reader(['en'])`)
  3. Fallback: Rule-based Heuristic Mock Engine (prevents service crashes when model weights are loading or offline).

---

### Phase 2: Image Input Pipeline
- **Implementation**: [`main.py`](file:///v:/legal-metrology-compliance/cv-service/app/main.py) and [`preprocessing.py`](file:///v:/legal-metrology-compliance/cv-service/app/preprocessing.py).
- **Format Support**: Accepts `.jpg`, `.jpeg`, `.png`, `.bmp`, `.webp`, Base64 strings, or `UploadFile` streams.
- **Decoding**: Converts binary streams to OpenCV uint8 matrix arrays using `cv2.imdecode(nparr, cv2.IMREAD_COLOR)`.
- **Resolution Handling**: Automatically handles resolutions from 400px low-res up to 4K ultra-high-resolution images.

---

### Phase 3: Image Quality Checking
- **Implementation**: [`image_quality.py`](file:///v:/legal-metrology-compliance/cv-service/app/image_quality.py) -> `assess_image_quality()`.
- **Metrics Evaluated**:
  1. **Blur Detection**: Uses Variance of Laplacian method (`cv2.Laplacian(gray, cv2.CV_64F).var()`). Variance `< 100.0` flags blurry photos.
  2. **Brightness Check**: Computes mean grayscale pixel intensity (`np.mean(gray)`). Mean `< 40.0` indicates underexposure; mean `> 220.0` indicates overexposure.
  3. **Glare Detection**: Creates a specular reflection mask (`gray > 240`). Glare pixel ratio `> 15%` flags severe reflection.
  4. **Composite Score**: Calculated as:
     $$\text{Score} = 0.50 \times \text{Sharpness} + 0.25 \times \text{Brightness} + 0.25 \times \text{Glare}$$
  5. **Quality Status Categorization**:
     - `GOOD`: Score $\ge 0.80$ and `blur == False`
     - `WARNING`: $0.50 \le \text{Score} < 0.80$
     - `RETAKE`: Score $< 0.50$ (forces image re-capture recommendation).

---

### Phase 4: Image Preprocessing Pipeline
- **Implementation**: [`preprocessing.py`](file:///v:/legal-metrology-compliance/cv-service/app/preprocessing.py) -> `preprocess_package_image()`.
- **Pipeline Steps**:
  1. **Preserve Raw Original**: Holds uncalibrated BGR image array for evidence output and compliance records.
  2. **Aspect-Ratio Rescaling**: Scales down images larger than 1600px max dimension, preserving aspect ratio and storing `scale_factor` to map coordinates back accurately.
  3. **Grayscale Conversion**: `cv2.cvtColor(BGR, cv2.COLOR_BGR2GRAY)`.
  4. **CLAHE Contrast Enhancement**: Contrast Limited Adaptive Histogram Equalization (`clipLimit=2.5, tileGridSize=(8, 8)`) to equalize uneven illumination.
  5. **Bilateral Noise Reduction**: `cv2.bilateralFilter(d=9, sigmaColor=75, sigmaSpace=75)` removes surface texture noise while sharpening text boundaries.
  6. **Sharpening Convolution**: Applied 2D filter kernel $\begin{bmatrix} 0 & -1 & 0 \\ -1 & 5 & -1 \\ 0 & -1 & 0 \end{bmatrix}$ to maximize character edge contrast before OCR execution.

---

### Phase 5 & 6: OCR Pipeline & Text Result Processing
- **Implementation**: [`ocr.py`](file:///v:/legal-metrology-compliance/cv-service/app/ocr.py) -> `extract_text_from_image()`, `clean_ocr_text()`.
- **Coordinate Inverse Mapping**: Rescales bounding box polygon vertices $[[x_1,y_1], [x_2,y_2], [x_3,y_3], [x_4,y_4]]$ back to the original image dimensions using `1.0 / scale_factor`.
- **Bounding Box Normalization**: Formats boxes as `[x1, y1, x2, y2]`.
- **Text Cleaning**: Removes extra whitespace, non-printable characters, and standardizes space separators while retaining original punctuation.
- **Structured JSON Payload**: Each detected text region contains:
  ```json
  {
    "text": "MRP Rs 240.00 (Incl of all taxes)",
    "confidence": 0.95,
    "bbox": [50, 180, 480, 225]
  }
  ```

---

### Phase 7 & 8: Declaration Extraction & Confidence Review
- **Implementation**: [`declaration_extractor.py`](file:///v:/legal-metrology-compliance/cv-service/app/declaration_extractor.py), [`field_patterns.yaml`](file:///v:/legal-metrology-compliance/cv-service/app/rules/field_patterns.yaml).
- **Rule Configuration**: Declarations defined in YAML with prioritized regex arrays and normalization rules.
- **Mandatory Package Fields Handled**:
  - `MRP`: Maximum Retail Price (normalizes to e.g., `"240.00 INR"`).
  - `NET_QUANTITY`: Net Weight/Volume (normalizes units e.g., `"1000 ml"`, `"500 g"`).
  - `MANUFACTURER`: Manufacturer / Packer / Marketer details.
  - `CONSUMER_CARE`: Helpline number / Email address.
  - `COUNTRY_OF_ORIGIN`: Mandatory for imported goods.
  - `MFG_DATE`: Date of manufacture / packing.
- **Confidence Scoring & Flagging**:
  - `HIGH` ($\ge 0.85$): Auto-approved.
  - `MEDIUM` ($0.70 \le \text{Conf} < 0.85$): Auto-approved with notice.
  - `LOW` ($< 0.70$) & `NONE` ($0.0$): Marks `requires_review = True` and sets `confidence_level = LOW/NONE`.
  - **Human-in-the-Loop Safeguard**: Low confidence extractions trigger a `REVIEW` flag rather than an immediate compliance failure, allowing Legal Metrology Officers to verify edge cases manually.

---

### Phase 9: Evidence Generation & Visual Overlay
- **Implementation**: [`evidence.py`](file:///v:/legal-metrology-compliance/cv-service/app/evidence.py) -> `generate_evidence_data()`.
- **Visual Evidence Features**:
  1. **Annotated Image Overlay**: Draws bounding boxes around detected declarations on the original image canvas. Color coded by confidence:
     - 🟢 Green (`HIGH` confidence)
     - 🟡 Amber (`MEDIUM` confidence)
     - 🔴 Red (`LOW` confidence)
     - 🩶 Grey (`NONE` / Not Found)
  2. **Field Labeling**: Annotates field name tags and confidence levels on the visual frame.
  3. **Cropped Region-of-Interest (ROI) Snippets**: Crops each declaration bounding box with a 10px boundary buffer and encodes as Base64 Data URL (`data:image/jpeg;base64,...`).

---

### Phase 10: Backend Integration & FastAPI Service
- **Implementation**: [`main.py`](file:///v:/legal-metrology-compliance/cv-service/app/main.py).
- **API Endpoint**: `POST /ocr/extract`
  - Form Data: `file` (UploadFile, optional image file), `product_id` (string).
  - Returns complete JSON payload containing `image_quality`, `ocr_result`, `extracted_declarations`, `declaration_confidence`, and `evidence`.
- **CORS Support**: Pre-configured middleware allowing frontend / backend cross-origin requests.

---

### Phase 11: Synthetic Test Dataset & Pipeline Validation
- **Implementation**: [`generate_test_images.py`](file:///v:/legal-metrology-compliance/generate_test_images.py), [`test_cv_pipeline.py`](file:///v:/legal-metrology-compliance/cv-service/app/test_cv_pipeline.py).
- **Test Dataset Composition** (`test_data/`):
  1. `compliant/compliant_almond_milk_back.png` (Food package - 100% compliant)
  2. `compliant/compliant_detergent_powder.png` (Household product - 100% compliant)
  3. `potential_violation/violation_missing_consumer_care.png` (Missing mandatory helpline)
  4. `potential_violation/violation_imported_missing_origin.png` (Imported product missing Country of Origin)
  5. `poor_quality/poor_quality_blurry_package.png` (Gaussian blur - triggers `RETAKE`/`WARNING`)
  6. `poor_quality/poor_quality_glare_package.png` (Specular reflection - triggers `WARNING`)
- **Automated Validation**: `test_cv_pipeline.py` executes end-to-end checks across quality detection, preprocessing, OCR, declaration parsing, and evidence generation.

---

### Phase 12: Final Data Output Schema to Person 1

The response strictly complies with [`docs/data-contract.json`](file:///v:/legal-metrology-compliance/docs/data-contract.json):

```json
{
  "status": "success",
  "file_name": "sample.png",
  "product_id": "PROD_AUDIT_001",
  "image_quality": {
    "score": 0.95,
    "quality_status": "GOOD",
    "is_acceptable": true,
    "blur": false,
    "glare": false,
    "brightness_ok": true,
    "reasons": ["Image quality is good for OCR analysis."]
  },
  "ocr_result": {
    "product_id": "PROD_AUDIT_001",
    "extracted_text": [
      {
        "text": "MRP Rs 240.00 (Incl of all taxes)",
        "confidence": 0.95,
        "bbox": [50, 180, 480, 225]
      },
      {
        "text": "Net Qty: 1000 ml",
        "confidence": 0.94,
        "bbox": [50, 250, 320, 295]
      }
    ],
    "engine_used": "paddle",
    "status": "success"
  },
  "extracted_declarations": {
    "MRP": {
      "field_id": "MRP",
      "field_name": "Maximum Retail Price",
      "raw": "MRP Rs 240.00 (Incl of all taxes)",
      "value": "240.00 INR",
      "confidence": 0.95,
      "confidence_level": "HIGH",
      "requires_review": false,
      "bbox": [50, 180, 480, 225]
    },
    "NET_QUANTITY": {
      "field_id": "NET_QUANTITY",
      "field_name": "Net Quantity",
      "raw": "Net Qty: 1000 ml",
      "value": "1000 ml",
      "confidence": 0.94,
      "confidence_level": "HIGH",
      "requires_review": false,
      "bbox": [50, 250, 320, 295]
    }
  },
  "declaration_confidence": {
    "MRP": "HIGH",
    "NET_QUANTITY": "HIGH",
    "MANUFACTURER": "HIGH",
    "CONSUMER_CARE": "HIGH",
    "COUNTRY_OF_ORIGIN": "HIGH"
  },
  "evidence": {
    "status": "success",
    "evidence_records": {
      "MRP": {
        "product_id": "PROD_AUDIT_001",
        "bbox": [50, 180, 480, 225],
        "extracted_text": "MRP Rs 240.00 (Incl of all taxes)",
        "value": "240.00 INR",
        "confidence": 0.95,
        "confidence_level": "HIGH",
        "requires_review": false,
        "snippet_b64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      }
    },
    "annotated_image_b64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
}
```

---

## File Sitemap & Code Links

| File / Component | Purpose / Functionality | Link |
|---|---|---|
| `requirements.txt` | Microservice dependencies (FastAPI, OpenCV, PaddleOCR, EasyOCR, Pillow, PyYAML) | [`requirements.txt`](file:///v:/legal-metrology-compliance/cv-service/requirements.txt) |
| `app/main.py` | FastAPI application entry point & `/ocr/extract` route handler | [`main.py`](file:///v:/legal-metrology-compliance/cv-service/app/main.py) |
| `app/image_quality.py` | Quality checks: Laplacian blur, illumination, glare, composite score | [`image_quality.py`](file:///v:/legal-metrology-compliance/cv-service/app/image_quality.py) |
| `app/preprocessing.py` | Image filters: CLAHE, Bilateral Denoising, Sharpening, Rescaling | [`preprocessing.py`](file:///v:/legal-metrology-compliance/cv-service/app/preprocessing.py) |
| `app/ocr.py` | Multi-engine text extraction, bbox scaling, text cleaning | [`ocr.py`](file:///v:/legal-metrology-compliance/cv-service/app/ocr.py) |
| `app/declaration_extractor.py` | Regex pattern matching, value normalization, review thresholding | [`declaration_extractor.py`](file:///v:/legal-metrology-compliance/cv-service/app/declaration_extractor.py) |
| `app/rules/field_patterns.yaml` | Yaml rules for legal metrology mandatory declarations | [`field_patterns.yaml`](file:///v:/legal-metrology-compliance/cv-service/app/rules/field_patterns.yaml) |
| `app/evidence.py` | Annotated overlay drawing & Base64 snippet generation | [`evidence.py`](file:///v:/legal-metrology-compliance/cv-service/app/evidence.py) |
| `app/test_cv_pipeline.py` | Automated pipeline test suite | [`test_cv_pipeline.py`](file:///v:/legal-metrology-compliance/cv-service/app/test_cv_pipeline.py) |
| `generate_test_images.py` | Synthetic product image test generator | [`generate_test_images.py`](file:///v:/legal-metrology-compliance/generate_test_images.py) |

---

## Service Execution & Verification Instructions

### 1. Run Automated Test Suite
To verify the entire computer vision and OCR pipeline:
```bash
python cv-service/app/test_cv_pipeline.py
```

### 2. Generate Test Dataset Images
To create sample packaging images (compliant, non-compliant, blurry, glared):
```bash
python generate_test_images.py
```

### 3. Launch FastAPI OCR Microservice
To start the REST API server on `http://localhost:8001`:
```bash
python cv-service/app/main.py
```
Or with uvicorn CLI:
```bash
uvicorn cv-service.app.main:app --host 0.0.0.0 --port 8001 --reload
```

---
*Documentation maintained by Person 2 – Computer Vision & OCR Specialist.*
