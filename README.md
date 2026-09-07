# ⚖️ Legal Metrology Compliance System

An intelligent inspection assistant designed for **Legal Metrology Officers** to audit mandatory packaging declarations under the **Legal Metrology (Packaged Commodities) Rules, 2011**.

> [!IMPORTANT]
> **System Purpose & Principles**:
> The system acts as an **inspection assistant** for human officers, not an autonomous legal decision-maker. Officer decisions remain the final legal authority.
> Under our Data Contract, "not detected" does NOT automatically mean "not present." Uncertainty in OCR yields `NEEDS_REVIEW` or `POTENTIAL_VIOLATION` based on evidence.

---

## 🏗️ Architecture & Technology Stack

- **Backend**: Python 3.10+, FastAPI, SQLite + SQLAlchemy
- **CV / OCR Service**: Python, OpenCV, Pillow (Mock OCR text extraction conforming to Data Contract)
- **Frontend**: React, Vite, Custom Modern CSS Design System with dark mode styling
- **Reports**: Python, ReportLab (PDF Inspection Report generator)
- **API Protocol**: REST / JSON

---

## 📁 Repository Directory Structure

```
legal-metrology-compliance/
│
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   ├── database.py       # SQLite & SQLAlchemy engine configuration
│   │   │   └── tables.py         # Table creation initialization script
│   │   ├── models/
│   │   │   ├── product.py        # Product ORM schema
│   │   │   ├── inspection.py     # Inspection ORM schema
│   │   │   └── violation.py      # Violation ORM schema
│   │   ├── routes/
│   │   │   ├── analyze.py        # POST /analyze endpoint
│   │   │   ├── inspection.py     # GET /inspection/{id} & POST /officer-review
│   │   │   └── dashboard.py      # GET /dashboard endpoint
│   │   ├── rules/
│   │   │   └── packaged_commodities.json # Initial mandatory declarations configuration
│   │   ├── services/
│   │   │   ├── compliance_engine.py  # Rule evaluator (COMPLIANT, POTENTIAL_VIOLATION, NEEDS_REVIEW)
│   │   │   ├── product_parser.py     # OCR text parser & regex profile extractor
│   │   │   └── inspection_service.py # SQLite database persistence manager
│   │   └── main.py              # FastAPI main application
│   ├── requirements.txt
│   └── README.md
│
├── cv-service/
│   ├── app/
│   │   ├── image_quality.py      # Sharpness/blur metric calculation
│   │   ├── preprocessing.py     # Grayscale & adaptive thresholding
│   │   ├── ocr.py                # Data-contract conforming OCR extraction
│   │   └── main.py               # CV FastAPI entrypoint
│   ├── requirements.txt
│   └── README.md
│
├── docs/
│   └── data-contract.json        # Data Contract specification (OCR, Product Profile, Compliance)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalysisResult.jsx
│   │   │   ├── DashboardCards.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── InspectionTable.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── OfficerReview.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── NewInspectionPage.jsx
│   │   ├── services/
│   │   │   └── api.js            # REST API client with mock fallback
│   │   ├── types/
│   │   │   └── index.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── reports/
│   ├── report_generator.py       # ReportLab PDF generator
│   ├── requirements.txt
│   └── README.md
│
├── test_data/
│   ├── compliant/                # Sample compliant packaging images
│   ├── potential_violation/     # Sample non-compliant images
│   └── poor_quality/            # Sample low-quality/blurry images
│
├── .gitignore
└── README.md
```

---

## 🚀 How to Run Each Service

### 1. Run Backend Service (FastAPI)
```bash
# Install backend dependencies
pip install -r backend/requirements.txt

# Start backend server (runs on http://localhost:8000)
uvicorn backend.app.main:app --reload --port 8000
```
Verify health check: `curl http://localhost:8000/`

### 2. Run CV / OCR Service
```bash
# Install CV dependencies
pip install -r cv-service/requirements.txt

# Start CV service (runs on http://localhost:8001)
uvicorn cv-service.app.main:app --reload --port 8001
```

### 3. Run Frontend (React + Vite)
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

### 4. Generate Sample PDF Inspection Report
```bash
# Install report dependencies
pip install -r reports/requirements.txt

# Execute PDF generator script
python reports/report_generator.py
```

---

## 👥 4-Person Team Responsibilities & Ownership

- **Person 1: Backend + Compliance Engine + Integration**
  - Owns `backend/app/routes/`, `backend/app/services/compliance_engine.py`, and rule file updates.
  - Integrates CV OCR payload into SQLite database models.

- **Person 2: OCR + Computer Vision**
  - Owns `cv-service/app/`.
  - Integrates real OCR engines (PaddleOCR / Tesseract / EasyOCR) and enhances image preprocessing filters.

- **Person 3: Frontend**
  - Owns `frontend/src/`.
  - Enhances UI components, live bounding box rendering on package images, and audit dashboard charts.

- **Person 4: Evidence + Reports + Testing**
  - Owns `reports/report_generator.py` and `test_data/`.
  - Creates test cases, adds image evidence thumbnails into PDF reports, and builds test suite.

---

## 🎯 Next 5 Implementation Milestones

1. **Integrate Real OCR Engine**: Replace mock OCR in `cv-service/app/ocr.py` with PaddleOCR or Tesseract OCR.
2. **Bounding Box Visualization**: Render interactive bounding boxes over uploaded packaging images in the React frontend.
3. **Advanced Legal Metrology Rules**: Extend `packaged_commodities.json` with Unit Sale Price (USP) calculations and font height compliance checks.
4. **PDF Report Download Integration**: Add a "Download Inspection Report (PDF)" button in the React UI invoking `reports/report_generator.py`.
5. **Batch Catalog Feed Audit**: Support CSV/JSON catalog file uploads for bulk compliance auditing.
