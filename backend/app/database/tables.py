from app.database.database import database
from pymongo.errors import CollectionInvalid

COLLECTIONS = ("products", "inspections", "violations", "reports", "users")

def init_db():
    """Verify MongoDB, create required collections, and initialize indexes."""
    database.client.admin.command("ping")

    existing_collections = set(database.list_collection_names())
    for collection_name in COLLECTIONS:
        if collection_name not in existing_collections:
            try:
                database.create_collection(collection_name)
            except CollectionInvalid:
                # Another initializer may have created it concurrently.
                pass

    database.inspections.create_index("created_at")
    database.inspections.create_index("status")
    database.inspections.create_index("officer_decision")
    database.violations.create_index("inspection_id")

if __name__ == "__main__":
    print("Initializing MongoDB collections and indexes...")
    init_db()
    print("MongoDB collections and indexes initialized successfully.")
