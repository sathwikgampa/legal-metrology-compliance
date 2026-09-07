import uuid
from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from backend.app.database.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_name = Column(String, nullable=True, default="")
    manufacturer = Column(String, nullable=True, default="")
    packer = Column(String, nullable=True, default="")
    importer = Column(String, nullable=True, default="")
    net_quantity = Column(String, nullable=True, default="")
    mrp = Column(String, nullable=True, default="")
    date = Column(String, nullable=True, default="")
    consumer_care = Column(Text, nullable=True, default="")
    country_of_origin = Column(String, nullable=True, default="")

    inspections = relationship("Inspection", back_populates="product", cascade="all, delete-orphan")
