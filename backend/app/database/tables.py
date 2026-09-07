from backend.app.database.database import engine, Base
import backend.app.models  # Ensures all models are registered with Base

def init_db():
    """Create all tables in the SQLite database if they do not exist."""
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    print("Initializing SQLite database tables...")
    init_db()
    print("Database tables initialized successfully.")
