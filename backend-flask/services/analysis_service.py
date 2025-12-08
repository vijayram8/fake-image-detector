from __future__ import annotations

import io
from typing import Any, Dict

from PIL import Image

from detectors.ai_classifier import AIClassifier
from detectors.manipulation_detector import ManipulationDetector, serialize_result
from detectors.noiseprint import NoiseprintAnalyzer, serialize_noise
from utils import exif


class ImageAnalysisService:
    def __init__(self) -> None:
        self._ai_classifier = AIClassifier()
        self._manipulation_detector = ManipulationDetector()
        self._noise_analyzer = NoiseprintAnalyzer()

    def analyze(self, file_storage) -> Dict[str, Any]:
        image_bytes = file_storage.read()
        buffer = io.BytesIO(image_bytes)

        ai_result = self._ai_classifier.predict(io.BytesIO(image_bytes))
        manipulation_result = self._manipulation_detector.predict(io.BytesIO(image_bytes))

        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        noise_result = self._noise_analyzer.analyze(pil_image)

        buffer.seek(0)
        metadata = exif.extract_metadata(buffer)
        metadata_flags = exif.flag_metadata(metadata if isinstance(metadata, dict) else {})

        verdict = self._derive_verdict(ai_result, manipulation_result, noise_result.noise_score, metadata_flags)

        return {
            **ai_result,
            **serialize_result(manipulation_result),
            **serialize_noise(noise_result),
            "metadata": metadata,
            "metadata_flags": metadata_flags,
            "verdict": verdict,
        }

    @staticmethod
    def _derive_verdict(
        ai_result: Dict[str, Any],
        manipulation_result,
        noise_score: float,
        metadata_flags: Dict[str, str],
    ) -> str:
        ai_score = ai_result.get("ai_score", 0)
        manipulation_score = manipulation_result.manipulation_score
        noise_alert = noise_score >= 0.6

        # High AI score = AI-generated (regardless of manipulation)
        if ai_score >= 0.7:
            if manipulation_score >= 0.5:
                base = "AI-generated with edits"
            else:
                base = "AI-generated"
        # Low AI score but high manipulation = Real photo that was edited
        elif ai_score < 0.4 and manipulation_score >= 0.5:
            base = "Real but edited/manipulated"
        # Medium AI score with manipulation = unclear, lean toward manipulation
        elif manipulation_score >= 0.6:
            base = "Likely manipulated"
        # Noise inconsistencies without other signals
        elif noise_alert:
            base = "Suspicious noise patterns"
        # Low scores across the board = likely authentic
        else:
            base = "Likely authentic"

        if metadata_flags.get("metadata_status") == "missing":
            base += " (no EXIF data)"
        return base
