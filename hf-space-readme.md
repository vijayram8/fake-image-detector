---
title: AI Image Authenticity Analyzer
emoji: 🔍
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# AI Image Authenticity Analyzer API

Deep learning-powered API to detect AI-generated and manipulated images.

## Features
- **AI Detection**: CLIP-based zero-shot classification
- **Manipulation Detection**: Error-Level Analysis (ELA) with heatmaps
- **Noise Analysis**: Wavelet-based sensor consistency checks
- **Metadata Forensics**: EXIF extraction and anomaly detection

## API Endpoints

### POST /analyze-image
Upload an image for analysis.

**Request**: `multipart/form-data` with `image` file

**Response**:
```json
{
  "ai_detection": {
    "ai_score": 0.85,
    "label": "likely_ai"
  },
  "manipulation": {
    "manipulation_score": 0.3,
    "heatmap_base64": "..."
  },
  "noise_analysis": {
    "noise_score": 0.2
  },
  "metadata": {
    "exif": {...}
  }
}
```

### GET /health
Health check endpoint.
