from flask import Flask
from flask_cors import CORS
import os

from .routes import api_bp


def create_app() -> Flask:
    """Application factory for the AI Image Authenticity Analyzer backend."""
    app = Flask(__name__)
    app.config.setdefault("MAX_CONTENT_LENGTH", 25 * 1024 * 1024)  # 25 MB uploads
    
    # Allow multiple origins for development and production
    allowed_origins = os.environ.get(
        "ALLOWED_ORIGINS", 
        "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    
    CORS(app, resources={r"/*": {"origins": allowed_origins}})
    app.register_blueprint(api_bp)
    return app
