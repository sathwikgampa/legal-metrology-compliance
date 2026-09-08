from datetime import datetime
from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class Inspection:
    id: str
    product_id: str
    status: str = "NEEDS_REVIEW"
    confidence: float = 0.0
    officer_decision: str = "PENDING"
    officer_remarks: str = ""
    created_at: datetime = field(default_factory=datetime.utcnow)
    product: Optional[object] = None
    violations: List[object] = field(default_factory=list)
