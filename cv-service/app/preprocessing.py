import cv2
import numpy as np
from typing import Union, Dict, Any, Tuple

def preprocess_package_image(image_input: Union[str, np.ndarray], max_dim: int = 1600) -> Dict[str, Any]:
    """
    Applies image preprocessing pipeline:
    1. Preserves raw original image for evidence display
    2. Resizes image while maintaining aspect ratio (max dimension 1600px)
    3. Grayscale conversion
    4. CLAHE contrast enhancement
    5. Bilateral noise filtering
    6. Sharpening filter
    Returns both original and processed image arrays along with scaling factor.
    """
    try:
        if isinstance(image_input, str):
            original = cv2.imread(image_input)
            if original is None:
                return {"success": False, "error": f"Unable to read image at path: {image_input}"}
        elif isinstance(image_input, np.ndarray):
            original = image_input.copy()
        else:
            return {"success": False, "error": "Invalid image input format"}

        h, w = original.shape[:2]

        # 1. Resize if max dimension exceeds max_dim
        scale_factor = 1.0
        if max(h, w) > max_dim:
            scale_factor = max_dim / float(max(h, w))
            new_w = int(w * scale_factor)
            new_h = int(h * scale_factor)
            resized = cv2.resize(original, (new_w, new_h), interpolation=cv2.INTER_AREA)
        else:
            resized = original.copy()

        # 2. Grayscale Conversion
        if len(resized.shape) == 3:
            gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
        else:
            gray = resized.copy()

        # 3. CLAHE Contrast Enhancement
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)

        # 4. Bilateral Noise Removal (preserves sharp text edges)
        denoised = cv2.bilateralFilter(enhanced, d=9, sigmaColor=75, sigmaSpace=75)

        # 5. Sharpening Kernel
        sharpen_kernel = np.array([
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
        ], dtype=np.float32)
        sharpened = cv2.filter2D(denoised, -1, sharpen_kernel)

        return {
            "success": True,
            "original": original,
            "processed": sharpened,
            "scale_factor": scale_factor,
            "original_shape": (h, w, original.shape[2] if len(original.shape) == 3 else 1),
            "processed_shape": sharpened.shape,
            "pipeline_applied": [
                "aspect_ratio_resize",
                "grayscale",
                "clahe_contrast_enhancement",
                "bilateral_denoise",
                "sharpen_filter"
            ]
        }

    except Exception as e:
        return {"success": False, "error": f"Image preprocessing failed: {str(e)}"}
