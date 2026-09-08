from dataclasses import dataclass, field
from typing import List

@dataclass
class Product:
    id: str
    product_name: str = ""
    manufacturer: str = ""
    packer: str = ""
    importer: str = ""
    net_quantity: str = ""
    mrp: str = ""
    date: str = ""
    consumer_care: str = ""
    country_of_origin: str = ""
    inspections: List[object] = field(default_factory=list)
