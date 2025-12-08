from http import HTTPStatus
from typing import Any, Dict

from flask import Blueprint, jsonify, request

from services.analysis_service import ImageAnalysisService
from utils.validation import allowed_file

api_bp = Blueprint("api", __name__)
analysis_service = ImageAnalysisService()


@api_bp.route("/health", methods=["GET"])
def health_check() -> Any:
    return jsonify({"status": "ok"}), HTTPStatus.OK


@api_bp.route("/analyze-image", methods=["POST"])
def analyze_image() -> Any:
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), HTTPStatus.BAD_REQUEST

    file = request.files["image"]

    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), HTTPStatus.BAD_REQUEST

    try:
        analysis: Dict[str, Any] = analysis_service.analyze(file)
        return jsonify(analysis), HTTPStatus.OK
    except Exception as exc:  # pragma: no cover - placeholder for logging
        return (
            jsonify({"error": "Internal server error", "details": str(exc)}),
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )
