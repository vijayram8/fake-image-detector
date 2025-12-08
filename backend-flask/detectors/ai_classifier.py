"""CLIP-based zero-shot detector estimating whether an image looks AI-generated."""

from __future__ import annotations

import logging
from typing import BinaryIO, Dict, List

import torch
from PIL import Image

LOGGER = logging.getLogger(__name__)


class AIClassifier:
    _model = None
    _processor = None
    _load_attempted: bool = False

    def __init__(self) -> None:
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        # Lazy load CLIP on first predict() call to avoid blocking server startup
        self.prompts: List[str] = [
            "a genuine photo captured with a DSLR or smartphone camera",
            "an ai-generated or synthetic image created with midjourney or stable diffusion",
        ]
    
    def _ensure_model_loaded(self) -> bool:
        """Lazy load CLIP model. Returns True if successful."""
        if not AIClassifier._load_attempted:
            AIClassifier._load_attempted = True
            try:
                LOGGER.info("Loading CLIP model for AI detection")
                from transformers import CLIPModel, CLIPProcessor
                import socket
                socket.setdefaulttimeout(10)
                AIClassifier._model = CLIPModel.from_pretrained(
                    "openai/clip-vit-base-patch32",
                    local_files_only=False
                )
                AIClassifier._processor = CLIPProcessor.from_pretrained(
                    "openai/clip-vit-base-patch32",
                    local_files_only=False
                )
                AIClassifier._model.eval()
                LOGGER.info("CLIP model loaded successfully")
            except (Exception, KeyboardInterrupt) as exc:
                LOGGER.warning("Unable to load CLIP, using fallback: %s", str(exc)[:100])
                AIClassifier._model = None
                AIClassifier._processor = None
        
        self.model = AIClassifier._model.to(self.device) if AIClassifier._model else None
        self.processor = AIClassifier._processor
        return self.model is not None

    def predict(self, image_stream: BinaryIO) -> Dict[str, float | Dict[str, float]]:
        # Lazy load model on first use
        self._ensure_model_loaded()
        
        if self.model is None or self.processor is None:
            # Fallback: Use heuristics based on image properties
            image_stream.seek(0)
            image = Image.open(image_stream).convert("RGB")
            ai_score = self._heuristic_score(image)
            probs = [1.0 - ai_score, ai_score]
        else:
            image_stream.seek(0)
            image = Image.open(image_stream).convert("RGB")
            inputs = self.processor(text=self.prompts, images=image, return_tensors="pt", padding=True)
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = outputs.logits_per_image.softmax(dim=-1).cpu().numpy()[0].tolist()

        ai_score = float(probs[1])
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
        """Fallback heuristic when CLIP unavailable. Checks for AI-typical patterns."""
        import numpy as np
        
        arr = np.array(image)
        
        # Check for overly smooth regions (AI often over-smooths)
        gray = np.mean(arr, axis=2)
        gradient = np.gradient(gray)
        smoothness = 1.0 - np.mean(np.abs(gradient[0]) + np.abs(gradient[1])) / 255.0
        
        # Check for unnatural color saturation
        hsv_arr = np.array(image.convert('HSV'))
        saturation = hsv_arr[:, :, 1].astype(float) / 255.0
        high_sat_ratio = np.mean(saturation > 0.7)
        
        # Combine indicators (lower scores for real photos)
        ai_indicators = smoothness * 0.4 + high_sat_ratio * 0.3
        
        # Return conservative score (0.2-0.5 range for fallback)
        return float(np.clip(0.2 + ai_indicators * 0.6, 0.15, 0.55))
