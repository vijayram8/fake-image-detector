# Image Forensics Analyzer

 **Full-stack web application for detecting manipulated and AI-generated images using computer vision forensics.**

##  Live Demo
- **Frontend**: [Your Vercel URL]
- **Backend API**: [Your Render URL]
- **GitHub**: https://github.com/vijayram8/fake-image-detector

---

##  Features

###  Detection Methods
1. **ELA (Error-Level Analysis)** - Industry-standard JPEG compression forensics
2. **Noiseprint Analysis** - Wavelet-based noise consistency detection  
3. **EXIF Metadata Forensics** - Camera/editing software verification
4. **AI Pattern Heuristics** - Lightweight AI-generation indicators

###  Analysis Outputs
- Manipulation probability scores
- Real-time heatmap visualization
- Metadata tampering detection
- Downloadable forensic reports

---

##  Tech Stack

### Backend
- **Python 3.12** - Core language
- **Flask** - REST API server
- **OpenCV** - Image processing
- **scikit-image** - Advanced analysis
- **PyWavelets** - Noise analysis
- **Waitress** - Production WSGI server

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - API client

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting (free tier optimized!)

---

##  Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### Backend Setup
```bash
cd backend-flask
pip install -r requirements.txt
python wsgi.py
```

Backend runs on `http://127.0.0.1:5000`

### Frontend Setup
```bash
cd frontend-react
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

##  Project Structure

```
 backend-flask/
    app/              # Flask application
    detectors/        # Forensic algorithms
       ai_classifier.py      # Heuristic AI detection
       manipulation_detector.py  # ELA analysis
       noiseprint.py         # Wavelet noise analysis
    services/         # Business logic
    utils/            # EXIF & validation
    requirements.txt

 frontend-react/
    src/
       components/   # React components
       hooks/        # Custom hooks
       types/        # TypeScript types
    package.json

 README.md
```

---

##  How It Works

### 1. Error-Level Analysis (ELA)
Detects manipulations by analyzing JPEG compression inconsistencies:
- Recompresses image at fixed quality
- Calculates pixel-level differences
- Generates heatmap showing edited regions

### 2. Noiseprint Detection
Uses wavelet decomposition to detect noise pattern inconsistencies:
- Analyzes high-frequency image components
- Detects cloned/spliced regions
- Identifies AI-generated smoothness

### 3. EXIF Forensics
Examines metadata for tampering indicators:
- Missing camera information
- Software editing signatures
- Timestamp inconsistencies

### 4. AI Heuristics
Lightweight pattern analysis (no ML models):
- Detects unnatural smoothness
- Analyzes color saturation patterns
- Checks noise distribution
- **Optimized for free-tier deployment!**

---

##  For Freshers/Students

This project demonstrates:
-  Full-stack development (React + Flask)
-  Computer vision algorithms
-  REST API design
-  Cloud deployment (Vercel + Render)
-  TypeScript & modern React
-  Professional code structure
-  Production optimization

**Perfect for your resume and interview discussions!**

---

##  API Endpoints

### `POST /analyze-image`
Upload image for forensic analysis

**Request:**
```
Content-Type: multipart/form-data
image: <file>
```

**Response:**
```json
{
  "ai_score": 0.45,
  "manipulation_score": 0.78,
  "noise_score": 0.32,
  "heatmap": "base64_encoded_image",
  "metadata": { ... },
  "verdict": "Real but edited/manipulated"
}
```

### `GET /health`
Health check endpoint

---

##  Why This Project Stands Out

1. **Real-World Application** - Solves actual problem (deepfakes, misinformation)
2. **Advanced Algorithms** - Not just CRUD, implements forensic techniques
3. **Production-Ready** - Deployed and working live
4. **Optimized** - Lightweight version works on free hosting tiers
5. **Professional Code** - Type hints, separation of concerns, error handling

---

##  Future Enhancements

- [ ] Batch image processing
- [ ] User authentication
- [ ] Analysis history storage
- [ ] More detection algorithms (frequency analysis, GAN fingerprinting)
- [ ] Mobile app version

---

##  License

MIT License - Feel free to use for learning and portfolios!

---

##  Author

**Vijayram**  
- GitHub: [@vijayram8](https://github.com/vijayram8)
- Project: [fake-image-detector](https://github.com/vijayram8/fake-image-detector)

---

##  Acknowledgments

- Error-Level Analysis technique from forensic research
- Wavelet denoising from scikit-image
- Inspired by professional fact-checking tools

---

** Star this repo if it helped you learn something new!**
