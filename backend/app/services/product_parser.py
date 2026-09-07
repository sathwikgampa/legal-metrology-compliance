import re
from typing import Dict, Any, List

def parse_ocr_to_product_profile(ocr_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parses raw OCR extracted text items into a structured Product Profile.
    Extracts MRP, Net Quantity, Dates, Manufacturer info, and Consumer Care details using basic regex patterns.
    """
    extracted_items: List[Dict[str, Any]] = ocr_result.get("extracted_text", [])
    combined_text = " ".join([item.get("text", "") for item in extracted_items])

    profile = {
        "product_name": "",
        "manufacturer": "",
        "packer": "",
        "importer": "",
        "net_quantity": "",
        "mrp": "",
        "date": "",
        "consumer_care": "",
        "country_of_origin": "",
        "other_declarations": []
    }

    # Extract MRP (e.g. MRP Rs. 120, MRP ₹120.00, Rs 50)
    mrp_match = re.search(r'(?:mrp|price|rs\.?|₹)\s*:?\s*(?:rs\.?|₹)?\s*([\d,]+(?:\.\d{2})?)', combined_text, re.IGNORECASE)
    if mrp_match:
        profile["mrp"] = f"₹{mrp_match.group(1)}"

    # Extract Net Quantity (e.g. 500 g, 1 kg, 250 ml, 1 L, 10 N)
    net_qty_match = re.search(r'(?:net\s*qty|net\s*quantity|net\s*wt|quantity)\s*:?\s*(\d+(?:\.\d+)?\s*(?:g|kg|ml|l|ltr|n|units?))', combined_text, re.IGNORECASE)
    if not net_qty_match:
        net_qty_match = re.search(r'(\d+(?:\.\d+)?\s*(?:g|kg|ml|l|ltr|n|units?))\b', combined_text, re.IGNORECASE)
    if net_qty_match:
        profile["net_quantity"] = net_qty_match.group(1)

    # Extract Date (e.g. Mfg: 08/2026, Packed 05/26, 12-2025)
    date_match = re.search(r'(?:mfg|pkd|packed|date|mfd)\s*:?\s*(\d{2}[/\.-]\d{2,4})', combined_text, re.IGNORECASE)
    if date_match:
        profile["date"] = date_match.group(1)

    # Extract Consumer Care (e.g. email, phone, care@brand.com, 1800-xxx-xxxx)
    email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', combined_text)
    phone_match = re.search(r'(?:1800|\+?91|phone|toll\s*free)\s*:?\s*[\d\s-]{8,13}', combined_text, re.IGNORECASE)
    if email_match or phone_match:
        details = []
        if email_match:
            details.append(email_match.group(0))
        if phone_match:
            details.append(phone_match.group(0).strip())
        profile["consumer_care"] = ", ".join(details)

    # Extract Manufacturer (e.g. Mfd by, Manufactured by ...)
    mfd_match = re.search(r'(?:mfd\s*by|manufactured\s*by|packed\s*by)\s*:?\s*([^,.\n]+)', combined_text, re.IGNORECASE)
    if mfd_match:
        profile["manufacturer"] = mfd_match.group(1).strip()

    # Extract Product Name (first text item or explicit name)
    if extracted_items:
        profile["product_name"] = extracted_items[0].get("text", "Packaged Item")

    return profile
