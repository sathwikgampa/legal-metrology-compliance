from dataclasses import dataclass
from typing import Optional

@dataclass
class Violation:
    id: str
    inspection_id: str
    field: str
    issue: str
    severity: str = "MEDIUM"
    confidence: float = 0.0
    rule_reference: str = "Legal Metrology (Packaged Commodities) Rules, 2011"
    inspection: Optional[object] = None
