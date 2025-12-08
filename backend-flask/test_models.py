"""Quick validation script to test all detectors work properly."""

import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image

# Add backend path for imports
sys.path.insert(0, str(Path(__file__).parent))

from detectors.ai_classifier import AIClassifier
from detectors.manipulation_detector import ManipulationDetector
from detectors.noiseprint import NoiseprintAnalyzer


def create_test_image() -> io.BytesIO:
    """Generate a simple test image."""
    arr = np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)
    img = Image.fromarray(arr)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


def main():
    print("=" * 60)
    print("Testing AI Image Detection Models")
    print("=" * 60)

    test_img = create_test_image()

    print("\n1. Testing AI Classifier (CLIP-based)...")
    try:
        classifier = AIClassifier()
        result = classifier.predict(test_img)
        print(f"   ✓ AI Score: {result['ai_score']:.3f}")
        print(f"   ✓ Label: {result['label']}")
        print(f"   ✓ Prompt scores: {result.get('prompt_scores', {})}")
    except Exception as exc:
        print(f"   ✗ Failed: {exc}")
        return 1

    print("\n2. Testing Manipulation Detector (ELA-based)...")
    try:
        test_img.seek(0)
        detector = ManipulationDetector()
        result = detector.predict(test_img)
        print(f"   ✓ Manipulation Score: {result.manipulation_score:.3f}")
        print(f"   ✓ Heatmap length: {len(result.heatmap_b64)} chars")
    except Exception as exc:
        print(f"   ✗ Failed: {exc}")
        return 1

    print("\n3. Testing Noise Analyzer (Noiseprint-inspired)...")
    try:
        test_img.seek(0)
        analyzer = NoiseprintAnalyzer()
        pil_img = Image.open(test_img).convert("RGB")
        result = analyzer.analyze(pil_img)
        print(f"   ✓ Noise Score: {result.noise_score:.3f}")
        print(f"   ✓ Heatmap length: {len(result.heatmap_b64)} chars")
    except Exception as exc:
        print(f"   ✗ Failed: {exc}")
        return 1

    print("\n" + "=" * 60)
    print("✓ All models working correctly!")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    sys.exit(main())
