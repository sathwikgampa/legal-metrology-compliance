import uuid
from sqlalchemy import Column, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.database import Base

class Violation(Base):
    __tablename__ = "violations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    inspection_id = Column(String, ForeignKey("inspections.id"), nullable=False)
    field = Column(String, nullable=False)
    issue = Column(Text, nullable=False)
    severity = Column(String, nullable=False, default="MEDIUM") # HIGH, MEDIUM, LOW
    confidence = Column(Float, nullable=False, default=0.0)
    rule_reference = Column(String, nullable=False, default="Legal Metrology (Packaged Commodities) Rules, 2011")

    inspection = relationship("Inspection", back_populates="violations")
