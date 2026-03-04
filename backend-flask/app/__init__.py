from flask import Flask
from flask_cors import CORS
import os

from .routes import api_bp


def create_app() -> Flask:
    """Application factory for the AI Image Authenticity Analyzer backend."""
    app = Flask(__name__)
    app.config.setdefault("MAX_CONTENT_LENGTH", 25 * 1024 * 1024)  # 25 MB uploads
    
    # Allow all origins for public API access (mobile, web, etc.)
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.register_blueprint(api_bp)
    return app
