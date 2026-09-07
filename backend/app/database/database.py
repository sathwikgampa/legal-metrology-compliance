import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "legal_metrology")

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)

database = client[MONGODB_DATABASE]

def get_db():
    yield database