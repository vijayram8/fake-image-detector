"""Lightweight AI-Generated Image Classifier using heuristic analysis."""

from __future__ import annotations

import logging
from typing import BinaryIO, Dict, List

import numpy as np
from PIL import Image

LOGGER = logging.getLogger(__name__)


class AIClassifier:
    """Detector for AI-generated images using heuristic pattern analysis."""

    def __init__(self) -> None:
        # Lightweight version - uses only heuristics (no CLIP/PyTorch)
        LOGGER.info("Using lightweight heuristic AI detection (optimized for free deployment)")
        self.prompts: List[str] = [
            "a genuine photo captured with a DSLR or smartphone camera",
            "an ai-generated or synthetic image created with midjourney or stable diffusion",
        ]
    def predict(self, image_stream: BinaryIO) -> Dict[str, float | Dict[str, float]]:
        """Analyze image using heuristic methods (no ML models)."""
        image_stream.seek(0)
        image = Image.open(image_stream).convert("RGB")
        ai_score = self._heuristic_score(image)
        probs = [1.0 - ai_score, ai_score]

        label = "likely_ai" if ai_score >= 0.7 else "uncertain" if ai_score >= 0.4 else "likely_real"
        return {
            "ai_score": ai_score,
            "label": label,
            "prompt_scores": {
                "real_photo": float(probs[0]),
                "ai_generated": float(probs[1]),
            },
        }
    def _heuristic_score(self, image: Image.Image) -> float:
        """Fallback heuristic detecting AI-typical patterns (no ML models required)."""
        arr = np.array(image)
        
        # Check for overly smooth regions (AI often over-smooths)
        gray = np.mean(arr, axis=2)
        gradient = np.gradient(gray)
        smoothness = 1.0 - np.mean(np.abs(gradient[0]) + np.abs(gradient[1])) / 255.0
        
        # Check for unnatural color saturation
        hsv_arr = np.array(image.convert('HSV'))
        saturation = hsv_arr[:, :, 1].astype(float) / 255.0
        high_sat_ratio = np.mean(saturation > 0.7)
        
        # Check for uniform noise distribution (real cameras have specific noise patterns)
        noise_variance = np.var(arr.astype(float) - np.mean(arr, axis=(0, 1)))
        normalized_noise = np.clip(noise_variance / 1000.0, 0, 1)
        
        # Combine indicators
        ai_indicators = (smoothness * 0.35) + (high_sat_ratio * 0.30) + ((1.0 - normalized_noise) * 0.20)
        
        # Return conservative score (tuned for heuristics)
        return float(np.clip(0.25 + ai_indicators * 0.5, 0.20, 0.60))
