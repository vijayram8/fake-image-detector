from __future__ import annotations

import base64
from dataclasses import dataclass
from typing import Dict

import cv2
import numpy as np
from PIL import Image
from skimage.restoration import denoise_wavelet


@dataclass
class NoiseprintResult:
    noise_score: float
    heatmap_b64: str


class NoiseprintAnalyzer:
    def analyze(self, image: Image.Image) -> NoiseprintResult:
        rgb = np.asarray(image.convert("RGB"))
        gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
        gray_norm = gray / 255.0
        denoised = denoise_wavelet(gray_norm, channel_axis=None, rescale_sigma=True)
        residual = (gray_norm - denoised) * 255.0
        block_std = self._block_std(residual, block=32)
        variability = float(np.std(block_std) / (np.mean(block_std) + 1e-6))
        noise_score = float(np.clip(variability / 4.0, 0.0, 1.0))
        heatmap = self._heatmap_from_residual(residual)
        return NoiseprintResult(noise_score=noise_score, heatmap_b64=heatmap)

    @staticmethod
    def _block_std(residual: np.ndarray, block: int) -> np.ndarray:
        h, w = residual.shape
        blocks = []
        for y in range(0, h - block + 1, block):
            for x in range(0, w - block + 1, block):
                section = residual[y : y + block, x : x + block]
                blocks.append(np.std(section))
        return np.array(blocks) if blocks else np.array([0.0])

    @staticmethod
    def _heatmap_from_residual(residual: np.ndarray) -> str:
        abs_residual = np.abs(residual)
        if abs_residual.max() > 0:
            normalized = cv2.normalize(abs_residual, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        else:
            normalized = np.zeros_like(abs_residual, dtype=np.uint8)
        colored = cv2.applyColorMap(normalized, cv2.COLORMAP_VIRIDIS)
        _, buffer = cv2.imencode(".png", colored)
        return base64.b64encode(buffer.tobytes()).decode("utf-8")


def serialize_noise(result: NoiseprintResult) -> Dict[str, float | str]:
    return {
        "noise_score": result.noise_score,
        "noise_heatmap": result.heatmap_b64,
    }
