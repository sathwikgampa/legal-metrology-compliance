# Frontend - Legal Metrology Compliance Dashboard

React + Vite frontend dashboard for Legal Metrology Officers.

## Key Features
- **Modern Dashboard UI**: Real-time stats cards for Compliant, Potential Violations, and Needs Review items.
- **Package Inspection Audit Workflow**: Upload commodity images, inspect extracted declarations, and review missing declaration warnings.
- **Officer Final Review**: Input form for Legal Metrology Officer decisions (`APPROVED`, `REJECTED`, `FLAGGED`) and official notes.
- **Offline Resilient API Client**: Connects to FastAPI backend (`http://localhost:8000`), with built-in mock fallback for standalone demo execution.

## Run Instructions

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.
