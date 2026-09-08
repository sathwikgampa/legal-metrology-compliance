from app.database.database import database
from pymongo.errors import CollectionInvalid

COLLECTIONS = ("products", "inspections", "violations", "reports", "users")

TEMPORARY_DOCUMENTS = {
    "products": {
        "_id": "temporary-product",
        "id": "temporary-product",
        "product_name": "Temporary Test Product",
        "manufacturer": "Temporary Test Manufacturer",
        "source": "init_db_seed",
    },
    "inspections": {
        "_id": "temporary-inspection",
        "id": "temporary-inspection",
        "product_id": "temporary-product",
        "status": "NEEDS_REVIEW",
        "confidence": 0.0,
        "officer_decision": "PENDING",
        "source": "init_db_seed",
    },
    "violations": {
        "_id": "temporary-violation",
        "id": "temporary-violation",
        "inspection_id": "temporary-inspection",
        "field": "temporary_field",
        "issue": "Temporary seed document for database verification",
        "severity": "LOW",
        "confidence": 0.0,
        "source": "init_db_seed",
    },
    "reports": {
        "_id": "temporary-report",
        "id": "temporary-report",
        "inspection_id": "temporary-inspection",
        "status": "TEMPORARY",
        "source": "init_db_seed",
    },
    "users": {
        "_id": "temporary-user",
        "id": "temporary-user",
        "name": "Temporary Test User",
        "role": "TEST",
        "source": "init_db_seed",
    },
}

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

    for collection_name, document in TEMPORARY_DOCUMENTS.items():
        database[collection_name].update_one(
            {"_id": document["_id"]},
            {"$setOnInsert": document},
            upsert=True,
        )

    database.inspections.create_index("created_at")
    database.inspections.create_index("status")
    database.inspections.create_index("officer_decision")
    database.violations.create_index("inspection_id")

if __name__ == "__main__":
    print("Initializing MongoDB collections and indexes...")
    init_db()
    print("MongoDB collections and indexes initialized successfully.")
