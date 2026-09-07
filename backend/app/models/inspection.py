import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.database import Base

class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    status = Column(String, nullable=False, default="NEEDS_REVIEW") # COMPLIANT, POTENTIAL_VIOLATION, NEEDS_REVIEW
    confidence = Column(Float, nullable=False, default=0.0)
    officer_decision = Column(String, nullable=True, default="PENDING") # PENDING, APPROVED, REJECTED, FLAGGED
    officer_remarks = Column(Text, nullable=True, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="inspections")
    violations = relationship("Violation", back_populates="inspection", cascade="all, delete-orphan")
