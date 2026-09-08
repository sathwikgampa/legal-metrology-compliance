import os
import sys
import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))

from image_quality import assess_image_quality
from preprocessing import preprocess_package_image
from ocr import extract_text_from_image
from declaration_extractor import extract_declarations_from_ocr
from evidence import generate_evidence_data

def run_pipeline_test():
    print("=" * 60)
    print("      RUNNING PERSON 2 CV & OCR SERVICE TEST SUITE")
    print("=" * 60)

    # 1. Generate Test Synthetic Image
    img = np.zeros((600, 800, 3), dtype=np.uint8) + 245
    cv2.putText(img, "Organic Almond Milk 1L", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 0), 2)
    cv2.putText(img, "MRP Rs 240.00 (Incl of all taxes)", (50, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
    cv2.putText(img, "Net Qty: 500 g", (50, 250), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
    cv2.putText(img, "Mfg Date: 07/2026", (50, 310), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
    cv2.putText(img, "Mfd By: Pure Organics Foods India Pvt Ltd, Mumbai", (50, 370), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
    cv2.putText(img, "Customer Care: 1800-222-999 / care@purefoods.com", (50, 430), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
    cv2.putText(img, "Country of Origin: India", (50, 490), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)

    # Test Quality Check on Clean Image
    q_clean = assess_image_quality(img)
    print(f"\n[1] Quality Check (Clean Image): Status={q_clean['status']}, Score={q_clean['score']}")
    assert q_clean["status"] in ["GOOD", "WARNING"]

    # Test Quality Check on Blurry Image
    blurry_img = cv2.GaussianBlur(img, (35, 35), 0)
    q_blur = assess_image_quality(blurry_img)
    print(f"[2] Quality Check (Blurry Image): Status={q_blur['status']}, Score={q_blur['score']}, BlurFlag={q_blur['blur']}")
    assert q_blur["blur"] == True or q_blur["status"] in ["WARNING", "RETAKE"]

    # Test Preprocessing Pipeline
    prep_res = preprocess_package_image(img)
    print(f"\n[3] Preprocessing: Success={prep_res['success']}, Applied={prep_res['pipeline_applied']}")
    assert prep_res["success"] == True

    # Test OCR Extraction
    ocr_res = extract_text_from_image(prep_res["processed"])
    ocr_blocks = ocr_res.get("extracted_text", [])
    print(f"\n[4] OCR Extraction: Extracted {len(ocr_blocks)} text blocks")
    assert len(ocr_blocks) > 0

    # Test Declaration Extraction
    decl_res = extract_declarations_from_ocr(ocr_blocks)
    fields = decl_res.get("fields", {})
    print("\n[5] Declaration Extraction Results:")
    for fid, val in fields.items():
        print(f"   - {fid:20s}: Value='{val.get('value')}', Conf={val.get('confidence')}, Level={val.get('confidence_level')}")

    assert fields["MRP"]["value"] == "240.00 INR" or "240" in str(fields["MRP"]["value"])
    assert fields["NET_QUANTITY"]["value"] in ["500 g", "1 l"]
    assert "Pure Organics" in str(fields["MANUFACTURER"]["value"]) or fields["MANUFACTURER"]["value"] is not None
    assert fields["CONSUMER_CARE"]["value"] is not None
    assert fields["COUNTRY_OF_ORIGIN"]["value"] == "India"

    # Test Evidence Snippet & Overlay Generation
    evidence_res = generate_evidence_data(img, fields)
    print(f"\n[6] Evidence Generation: Status={evidence_res['status']}, Records={len(evidence_res.get('evidence_records', {}))}")
    assert evidence_res["status"] == "success"

    print("\n" + "=" * 60)
    print("  ALL PERSON 2 CV & OCR SERVICE VERIFICATIONS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_pipeline_test()
