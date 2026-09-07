# Backend - Legal Metrology Compliance API

This directory contains the Python FastAPI backend service responsible for managing product metadata, running rule-based compliance evaluation under the Legal Metrology (Packaged Commodities) Rules, 2011, persisting inspection data into SQLite via SQLAlchemy, and handling officer review decisions.

## Setup & Running

1. **Navigate to root directory**:
   ```bash
   cd legal-metrology-compliance
   ```

2. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Start the FastAPI Backend**:
   ```bash
   uvicorn backend.app.main:app --reload --port 8000
   ```

4. **Verify Health Endpoint**:
   Open `http://localhost:8000/` in browser or run:
   ```bash
   curl http://localhost:8000/
   # Output: {"message": "Legal Metrology API is running"}
   ```

5. **Interactive Swagger Docs**:
   Access `http://localhost:8000/docs`.

## Key Endpoints
- `GET /`: Health check endpoint.
- `POST /analyze`: Evaluates package text/OCR data against mandatory rules.
- `GET /inspection/{inspection_id}`: Retrieves inspection details & violations.
- `POST /officer-review`: Records officer approval/rejection decision.
- `GET /dashboard`: Returns statistics for dashboard summary.
