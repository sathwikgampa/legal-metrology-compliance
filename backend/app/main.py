import os
import sys

# Ensure root directory is on Python path so backend modules can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.tables import init_db
from app.routes.analyze import router as analyze_router
from app.routes.inspection import router as inspection_router
from app.routes.dashboard import router as dashboard_router

app = FastAPI(
    title="Legal Metrology Compliance System API",
    description="Backend API supporting Legal Metrology Officers in verifying packaged commodities compliance.",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Legal Metrology API is running"}

app.include_router(analyze_router)
app.include_router(inspection_router)
app.include_router(dashboard_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
