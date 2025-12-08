"""Error-Level-Analysis-based manipulation detector producing heatmaps."""

from __future__ import annotations

import base64
import io
from dataclasses import dataclass
from typing import BinaryIO, Dict

import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance


@dataclass
class ManipulationResult:
    manipulation_score: float
    heatmap_b64: str


class ManipulationDetector:
    def __init__(self, quality: int = 90) -> None:
        self.quality = quality

    def predict(self, image_stream: BinaryIO) -> ManipulationResult:
        image_stream.seek(0)
        image = Image.open(image_stream).convert("RGB")
        ela = self._compute_ela(image)
        manip_score = self._score_from_ela(ela)
        heatmap_b64 = self._create_heatmap(ela)
        return ManipulationResult(manipulation_score=manip_score, heatmap_b64=heatmap_b64)

    def _compute_ela(self, image: Image.Image) -> np.ndarray:
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=self.quality)
        buffer.seek(0)
        compressed = Image.open(buffer)
        ela_image = ImageChops.difference(image, compressed)
        ela_image = ImageEnhance.Brightness(ela_image).enhance(25)
        return np.asarray(ela_image).astype(np.float32)

    def _score_from_ela(self, ela: np.ndarray) -> float:
        magnitude = np.linalg.norm(ela / 255.0, axis=2)
        high_energy = np.percentile(magnitude, 99)
        return float(np.clip(high_energy, 0.0, 1.0))

    def _create_heatmap(self, ela: np.ndarray) -> str:
        magnitude = np.linalg.norm(ela, axis=2)
        normalized = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        colored = cv2.applyColorMap(normalized, cv2.COLORMAP_JET)
        success, buffer = cv2.imencode(".png", colored)
        if not success:
            return ""
        return base64.b64encode(buffer).decode("utf-8")


def serialize_result(result: ManipulationResult) -> Dict[str, float | str]:
    return {
        "manipulation_score": result.manipulation_score,
        "heatmap": result.heatmap_b64,
    }
