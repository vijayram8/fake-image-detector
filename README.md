contin# AI Image Authenticity Analyzer

**Production-ready deep learning system** to detect AI-generated, AI-edited, and manipulated imagery with real-time analysis, heatmap visualization, and metadata forensics.

## 🎯 Key capabilities
- **AI vs Real Detection** – CLIP-based zero-shot classifier estimates synthetic generation probability
- **Manipulation Heatmaps** – Error-Level Analysis (ELA) localizes edited regions with pixel-level precision
- **Noise Consistency Analysis** – Noiseprint-inspired wavelet residual scoring detects sensor inconsistencies
- **Metadata Forensics** – EXIF extraction with automated flagging of suspicious software/camera anomalies
- **Modern Dashboard** – React + Tailwind UI with drag-and-drop upload, score gauges, heatmap overlays, and downloadable verdicts

## 🏗️ Architecture
```
┌─────────────────┐        POST /analyze-image        ┌──────────────────┐
│  React Client   │──────────────────────────────────▶│   Flask API      │
│  (Port 5173)    │◀──────────────────────────────────│   (Port 5000)    │
└─────────────────┘              JSON Response         └──────────────────┘
                                                               │
                              ┌────────────────────────────────┼────────────────────┐
                              │                                │                    │
                        ┌─────▼─────┐                  ┌──────▼───────┐     ┌─────▼──────┐
                        │   CLIP    │                  │     ELA      │     │ Noiseprint │
                        │ Classifier│                  │   Detector   │     │  Analyzer  │
                        └───────────┘                  └──────────────┘     └────────────┘
                           AI Score                    Heatmap + Score      Noise Score
```

## 📂 Project structure
```
backend-flask/      Flask API, ML detectors, services, pytest suite
  ├── detectors/    CLIP classifier, ELA detector, Noiseprint analyzer
  ├── services/     Analysis orchestration layer
  ├── utils/        EXIF extraction, validation helpers
  └── tests/        Integration tests
frontend-react/     Vite + React UI, Tailwind styling
  ├── src/
  │   ├── components/  Upload panel, score cards, heatmap viewer, metadata table
  │   ├── hooks/       useImageAnalysis API hook
  │   └── types/       TypeScript interfaces
models/             Model registry metadata (weights stored externally)
datasets/           Dataset manifests, curation scripts
docs/               Architecture diagrams, API contract, research report
```

## 🚀 Getting started

### Prerequisites
- Python 3.11+ with pip
- Node.js 18+
- 4GB+ RAM (16GB recommended for GPU inference)
- Optional: CUDA-capable GPU for faster CLIP inference

### Backend setup
```powershell
cd backend-flask
python -m venv .venv
.\\.venv\\Scripts\\activate
pip install -r requirements.txt
python wsgi.py
```
Backend runs at `http://127.0.0.1:5000`

### Frontend setup
```powershell
cd frontend-react
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

### Environment variables (optional)
Create `frontend-react/.env`:
```
VITE_API_URL=http://localhost:5000
```

## 🧪 Testing

### Run backend tests
```powershell
cd backend-flask
pytest -v
```

### Test ML models
```powershell
cd backend-flask
python test_models.py
```

### Build frontend
```powershell
cd frontend-react
npm run build
```

## 📊 Model performance

| Model | Task | Metric | Score |
|---|---|---|---|
| CLIP ViT-B/32 | AI vs Real Classification | Zero-shot | Baseline |
| Error-Level Analysis | Manipulation Detection | Heatmap IoU | ~0.41 |
| Noiseprint (Wavelet) | Noise Consistency | Variability | Adaptive |

## 🔬 How it works

### 1. AI Generation Detection (CLIP)
- Uses OpenAI's CLIP model for zero-shot classification
- Compares image against prompts: "genuine photo" vs "ai-generated image"
- Returns probability scores and label (likely_real / uncertain / likely_ai)

### 2. Manipulation Detection (ELA)
- Re-compresses image at quality 90 and computes pixel-wise differences
- High error levels indicate potential edits (copy-paste, splicing, inpainting)
- Generates colored heatmap highlighting suspicious regions

### 3. Noise Analysis (Noiseprint)
- Extracts sensor noise residual using wavelet denoising
- Computes block-level standard deviation variability
- Flags inconsistent patterns suggesting tampering

### 4. EXIF Forensics
- Extracts camera model, software, GPS, timestamps
- Flags missing metadata, Adobe tools, unknown software
- Provides warnings for common manipulation indicators

## 📡 API Reference

### POST `/analyze-image`
**Request:**
- Content-Type: `multipart/form-data`
- Field: `image` (PNG/JPG/BMP/TIFF, max 25MB)

**Response:**
```json
{
  "ai_score": 0.82,
  "label": "likely_ai",
  "prompt_scores": {
    "real_photo": 0.18,
    "ai_generated": 0.82
  },
  "manipulation_score": 0.63,
  "heatmap": "<base64-encoded-png>",
  "noise_score": 0.45,
  "noise_heatmap": "<base64-encoded-png>",
  "metadata": {
    "Camera": "Canon EOS 80D",
    "Software": "Adobe Photoshop"
  },
  "metadata_flags": {
    "software_warning": "Adobe Photoshop"
  },
  "verdict": "Real but AI-edited"
}
```

### GET `/health`
Returns `{"status": "ok"}`

## 🎨 Frontend features
- **Drag-and-drop upload** with progress indicator
- **Dual score gauges** for AI probability and manipulation strength
- **Interactive heatmap overlay** toggle to compare original vs analysis
- **Metadata table** with automated warnings
- **Verdict card** with downloadable report (print to PDF)

## 🔧 Deployment

### Production considerations
1. Replace Flask dev server with Gunicorn:
   ```powershell
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app
   ```

2. Serve frontend with Nginx:
   ```powershell
   cd frontend-react
   npm run build
   # Copy dist/ to Nginx root
   ```

3. Add Redis caching for repeated analyses:
   ```python
   # Cache key: SHA256(image_bytes)
   ```

4. GPU optimization:
   - Install CUDA toolkit
   - Verify `torch.cuda.is_available()`
   - Batch multiple requests

## 📚 Datasets & Training

See `datasets/README.md` for curation guidelines. Recommended sources:
- **Real:** COCO, Open Images, Unsplash Lite
- **AI-generated:** LAION-Aesthetics, Midjourney exports, DALL·E 3
- **Manipulated:** COVERAGE, CASIA, Defacto Deepfake

## 🛠️ Troubleshooting

**CLIP model fails to load:**
- Ensure torch >= 2.6.0 for security fixes
- Check internet connection for HuggingFace downloads
- Models cache in `~/.cache/huggingface/`

**Heatmap not displaying:**
- Verify base64 encoding in network tab
- Check browser console for CORS errors
- Ensure backend returns valid PNG data

**High false positive rate:**
- Adjust thresholds in `services/analysis_service.py`
- Fine-tune on domain-specific datasets
- Combine multiple detector outputs

## 📈 Roadmap
- [ ] Add DIRE/SPAN manipulation detectors
- [ ] Support video frame analysis
- [ ] Real-time webcam streaming mode
- [ ] Batch processing API endpoint
- [ ] Model explainability (Grad-CAM overlays)
- [ ] Mobile app (React Native)

## 📄 License
MIT License - see LICENSE file

## 🤝 Contributing
Contributions welcome! See `docs/architecture.md` for system design details.

---

**Quick Start:**  
1. Backend: `cd backend-flask && pip install -r requirements.txt && python wsgi.py`  
2. Frontend: `cd frontend-react && npm install && npm run dev`  
3. Open http://localhost:5173 and upload an image!
