import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_DATA_DIR = os.path.join(BASE_DIR, "test_data")

COMPLIANT_DIR = os.path.join(TEST_DATA_DIR, "compliant")
VIOLATION_DIR = os.path.join(TEST_DATA_DIR, "potential_violation")
POOR_QUALITY_DIR = os.path.join(TEST_DATA_DIR, "poor_quality")

os.makedirs(COMPLIANT_DIR, exist_ok=True)
os.makedirs(VIOLATION_DIR, exist_ok=True)
os.makedirs(POOR_QUALITY_DIR, exist_ok=True)

def create_base_canvas(width=800, height=1000, bg_color=(248, 249, 250), border_color=(40, 116, 240)):
    """Creates a stylized product packaging container canvas."""
    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Outer border/frame simulating product box
    draw.rectangle([20, 20, width - 20, height - 20], outline=border_color, width=8)
    draw.rectangle([35, 35, width - 35, 140], fill=border_color)
    
    return img, draw

def render_sample_1_compliant_food():
    """Generates a fully compliant food product packaging image."""
    img, draw = create_base_canvas(border_color=(34, 139, 34))
    
    # Header
    draw.text((60, 50), "NATURAL HARVEST - ORGANIC ALMOND MILK", fill=(255, 255, 255))
    draw.text((60, 95), "100% Pure & Plant-Based Beverage", fill=(220, 255, 220))

    # Declarations
    draw.text((60, 180), "PRODUCT: Organic Almond Milk 1L", fill=(20, 20, 20))
    draw.text((60, 240), "MRP Rs. 240.00 (Incl. of all taxes)", fill=(20, 20, 20))
    draw.text((60, 300), "Net Quantity: 1000 ml", fill=(20, 20, 20))
    draw.text((60, 360), "Mfg Date: 07/2026", fill=(20, 20, 20))
    draw.text((60, 420), "Manufactured By: Pure Organics Foods Pvt Ltd", fill=(20, 20, 20))
    draw.text((60, 460), "Plot 42, Industrial Area, Mumbai - 400001", fill=(60, 60, 60))
    draw.text((60, 520), "Customer Care: 1800-222-999 / care@pureorganics.com", fill=(20, 20, 20))
    draw.text((60, 580), "Country of Origin: India", fill=(20, 20, 20))
    draw.text((60, 640), "Batch No: ALM-2026-07A", fill=(80, 80, 80))

    out_path = os.path.join(COMPLIANT_DIR, "compliant_almond_milk_back.png")
    img.save(out_path)
    print(f"Created: {out_path}")

def render_sample_2_compliant_detergent():
    """Generates a compliant household detergent package."""
    img, draw = create_base_canvas(border_color=(0, 102, 204))
    
    draw.text((60, 50), "SPARKLE ULTRA DETERGENT POWDER", fill=(255, 255, 255))
    draw.text((60, 95), "Advanced Stain Removal Formula", fill=(200, 230, 255))

    draw.text((60, 180), "PRODUCT: Sparkle Detergent Powder", fill=(20, 20, 20))
    draw.text((60, 240), "MRP Rs 145.00 (Inclusive of all taxes)", fill=(20, 20, 20))
    draw.text((60, 300), "Net Wt: 500 g", fill=(20, 20, 20))
    draw.text((60, 360), "Date of Packing: 06/2026", fill=(20, 20, 20))
    draw.text((60, 420), "Marketed By: Sparkle Homecare Consumer Products Ltd", fill=(20, 20, 20))
    draw.text((60, 460), "Sector 18, Gurugram, Haryana - 122015", fill=(60, 60, 60))
    draw.text((60, 520), "Consumer Care Cell: 1800-111-888 / help@sparkle.co.in", fill=(20, 20, 20))

    out_path = os.path.join(COMPLIANT_DIR, "compliant_detergent_powder.png")
    img.save(out_path)
    print(f"Created: {out_path}")

def render_sample_3_violation_missing_consumercare():
    """Generates packaging missing mandatory Consumer Care details."""
    img, draw = create_base_canvas(border_color=(204, 0, 0))
    
    draw.text((60, 50), "CRUNCHY BITES POTATO CHIPS", fill=(255, 255, 255))
    draw.text((60, 95), "Crispy & Spicy Flavor", fill=(255, 200, 200))

    draw.text((60, 180), "PRODUCT: Potato Chips", fill=(20, 20, 20))
    draw.text((60, 240), "MRP ₹30.00", fill=(20, 20, 20))
    draw.text((60, 300), "Net Qty: 75g", fill=(20, 20, 20))
    draw.text((60, 360), "Pkd Date: 08/2026", fill=(20, 20, 20))
    draw.text((60, 420), "Packed By: Snacko Foods India Ltd, Jaipur", fill=(20, 20, 20))
    # INTENTIONALLY OMITTED: Consumer Care Phone / Helpline

    out_path = os.path.join(VIOLATION_DIR, "violation_missing_consumer_care.png")
    img.save(out_path)
    print(f"Created: {out_path}")

def render_sample_4_violation_imported_missing_origin():
    """Generates imported packaging missing Country of Origin declaration."""
    img, draw = create_base_canvas(border_color=(180, 50, 0))
    
    draw.text((60, 50), "LUXURY BELGIAN CHOCOLATE TRUFFLES", fill=(255, 255, 255))
    draw.text((60, 95), "Imported Gourmet Collection", fill=(255, 220, 180))

    draw.text((60, 180), "PRODUCT: Fine Dark Chocolates", fill=(20, 20, 20))
    draw.text((60, 240), "MRP Rs 550.00 (Incl. all taxes)", fill=(20, 20, 20))
    draw.text((60, 300), "Net Weight: 250 g", fill=(20, 20, 20))
    draw.text((60, 360), "Imported By: Global Confections Pvt Ltd, Mumbai", fill=(20, 20, 20))
    draw.text((60, 420), "Customer Care: 1800-444-555", fill=(20, 20, 20))
    # INTENTIONALLY OMITTED: Country of Origin

    out_path = os.path.join(VIOLATION_DIR, "violation_imported_missing_origin.png")
    img.save(out_path)
    print(f"Created: {out_path}")

def render_sample_5_poor_quality_blurry():
    """Generates a blurry image triggering RETAKE / WARNING quality flag."""
    clean_path = os.path.join(COMPLIANT_DIR, "compliant_almond_milk_back.png")
    if os.path.exists(clean_path):
        cv_img = cv2.imread(clean_path)
        # Apply heavy motion blur / Gaussian blur
        blurry = cv2.GaussianBlur(cv_img, (45, 45), 0)
        out_path = os.path.join(POOR_QUALITY_DIR, "poor_quality_blurry_package.png")
        cv2.imwrite(out_path, blurry)
        print(f"Created: {out_path}")

def render_sample_6_poor_quality_glare():
    """Generates an overexposed/glare image triggering quality warning."""
    clean_path = os.path.join(COMPLIANT_DIR, "compliant_detergent_powder.png")
    if os.path.exists(clean_path):
        cv_img = cv2.imread(clean_path)
        # Create specular glare overlay
        glare_mask = np.zeros_like(cv_img)
        cv2.circle(glare_mask, (350, 350), 220, (255, 255, 255), -1)
        glare_img = cv2.addWeighted(cv_img, 0.5, glare_mask, 0.7, 0)
        out_path = os.path.join(POOR_QUALITY_DIR, "poor_quality_glare_package.png")
        cv2.imwrite(out_path, glare_img)
        print(f"Created: {out_path}")

if __name__ == "__main__":
    print("Generating sample test dataset images...")
    render_sample_1_compliant_food()
    render_sample_2_compliant_detergent()
    render_sample_3_violation_missing_consumercare()
    render_sample_4_violation_imported_missing_origin()
    render_sample_5_poor_quality_blurry()
    render_sample_6_poor_quality_glare()
    print("Test dataset generated successfully!")
