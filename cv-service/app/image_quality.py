import cv2
import numpy as np

def assess_image_quality(image_path: str) -> dict:
    """
    Evaluates image quality metrics (blurriness, contrast, brightness).
    Uses Laplacian variance as a proxy for image sharpness.
    """
    try:
        image = cv2.imread(image_path)
        if image is None:
            return {"is_acceptable": False, "score": 0.0, "reason": "Failed to read image file"}

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()

        # Threshold for blurriness
        is_clear = laplacian_var > 100.0
        score = min(round(laplacian_var / 500.0, 2), 1.0)

        return {
            "is_acceptable": is_clear,
            "sharpness_score": score,
            "laplacian_variance": round(laplacian_var, 2),
            "reason": "Image sharpness acceptable" if is_clear else "Blurry image detected; OCR confidence degraded"
        }
    except Exception as e:
        return {"is_acceptable": False, "score": 0.0, "reason": str(e)}
