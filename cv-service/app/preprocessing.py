import cv2
import numpy as np
from PIL import Image

def preprocess_package_image(image_path: str) -> dict:
    """
    Applies image preprocessing pipeline (grayscale conversion, thresholding, noise removal)
    to enhance text visibility for downstream OCR engines.
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            return {"success": False, "error": "Image file not found or invalid"}

        # 1. Convert to Grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 2. Apply Gaussian Blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # 3. Adaptive Thresholding
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )

        return {
            "success": True,
            "original_shape": img.shape,
            "processed_channels": 1,
            "pipeline_applied": ["grayscale", "gaussian_blur", "adaptive_threshold"]
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
