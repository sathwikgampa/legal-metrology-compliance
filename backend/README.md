# Backend - Legal Metrology Compliance API

This directory contains the Python FastAPI backend service responsible for managing product metadata, running rule-based compliance evaluation under the Legal Metrology (Packaged Commodities) Rules, 2011, persisting inspection data in MongoDB Atlas via PyMongo, and handling officer review decisions.

## Setup & Running

1. **Navigate to root directory**:
   ```bash
   cd legal-metrology-compliance
   ```

2. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configure MongoDB Atlas**:
   Set `MONGODB_URI` to your Atlas connection string and optionally set `MONGODB_DATABASE` (defaults to `legal_metrology`). Ensure the Atlas network access rules allow the backend host.

   PowerShell example:
   ```powershell
   $env:MONGODB_URI = "mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority"
   $env:MONGODB_DATABASE = "legal_metrology"
   ```

4. **Start the FastAPI Backend**:
   ```bash
   uvicorn backend.app.main:app --reload --port 8000
   ```

5. **Verify Health Endpoint**:
   Open `http://localhost:8000/` in browser or run:
   ```bash
   curl http://localhost:8000/
   # Output: {"message": "Legal Metrology API is running"}
   ```

6. **Interactive Swagger Docs**:
   Access `http://localhost:8000/docs`.

## Key Endpoints
- `GET /`: Health check endpoint.
- `POST /analyze`: Evaluates package text/OCR data against mandatory rules.
- `GET /inspection/{inspection_id}`: Retrieves inspection details & violations.
- `POST /officer-review`: Records officer approval/rejection decision.
- `GET /dashboard`: Returns statistics for dashboard summary.
