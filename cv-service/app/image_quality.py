import cv2
import numpy as np
from typing import Union, Dict, Any

def assess_image_quality(image_input: Union[str, np.ndarray]) -> Dict[str, Any]:
    """
    Evaluates image quality metrics using OpenCV:
    - Blur detection via Laplacian variance
    - Illumination/brightness level check
    - Glare/overexposure ratio
    - Aggregate quality score and GOOD / WARNING / RETAKE status
    """
    try:
        if isinstance(image_input, str):
            image = cv2.imread(image_input)
            if image is None:
                return {
                    "score": 0.0,
                    "status": "RETAKE",
                    "is_acceptable": False,
                    "blur": True,
                    "glare": False,
                    "brightness_ok": False,
                    "reasons": ["Failed to load image file."]
                }
        elif isinstance(image_input, np.ndarray):
            image = image_input
        else:
            return {
                "score": 0.0,
                "status": "RETAKE",
                "is_acceptable": False,
                "blur": True,
                "glare": False,
                "brightness_ok": False,
                "reasons": ["Invalid image input format."]
            }

        # Convert to Grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()

        reasons = []

        # 1. Blur Detection (Laplacian Variance)
        laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        is_blurry = laplacian_var < 100.0
        sharpness_score = min(round(laplacian_var / 300.0, 2), 1.0)
        if is_blurry:
            reasons.append(f"Image is blurry (Laplacian variance: {round(laplacian_var, 1)} < 100.0)")

        # 2. Brightness / Illumination Check
        mean_brightness = float(np.mean(gray))
        is_under_exposed = mean_brightness < 40.0
        is_over_exposed = mean_brightness > 220.0
        brightness_ok = not (is_under_exposed or is_over_exposed)

        if is_under_exposed:
            brightness_score = max(0.0, mean_brightness / 40.0)
            reasons.append(f"Low lighting detected (Mean brightness: {round(mean_brightness, 1)} < 40.0)")
        elif is_over_exposed:
            brightness_score = max(0.0, (255.0 - mean_brightness) / 35.0)
            reasons.append(f"Overexposed lighting (Mean brightness: {round(mean_brightness, 1)} > 220.0)")
        else:
            brightness_score = 1.0

        # 3. Glare Ratio Detection (Pixels > 240)
        glare_mask = gray > 240
        glare_ratio = float(np.sum(glare_mask) / gray.size)
        has_glare = glare_ratio > 0.15
        if has_glare:
            reasons.append(f"High reflection/glare detected ({round(glare_ratio * 100, 1)}% overexposed pixels)")

        glare_score = max(0.0, 1.0 - (glare_ratio / 0.30))

        # 4. Composite Quality Score
        quality_score = round(
            (0.50 * sharpness_score) + (0.25 * brightness_score) + (0.25 * glare_score),
            2
        )

        # 5. Status Mapping
        if quality_score >= 0.80 and not is_blurry:
            status = "GOOD"
            is_acceptable = True
        elif quality_score >= 0.50:
            status = "WARNING"
            is_acceptable = True
        else:
            status = "RETAKE"
            is_acceptable = False

        if not reasons:
            reasons.append("Image quality is good for OCR analysis.")

        return {
            "score": quality_score,
            "status": status,
            "is_acceptable": is_acceptable,
            "blur": is_blurry,
            "glare": has_glare,
            "brightness_ok": brightness_ok,
            "laplacian_variance": round(laplacian_var, 2),
            "mean_brightness": round(mean_brightness, 2),
            "glare_ratio": round(glare_ratio, 4),
            "reasons": reasons
        }

    except Exception as e:
        return {
            "score": 0.0,
            "status": "RETAKE",
            "is_acceptable": False,
            "blur": True,
            "glare": False,
            "brightness_ok": False,
            "reasons": [f"Error processing image quality: {str(e)}"]
        }
