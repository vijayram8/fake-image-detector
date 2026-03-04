# AI Image Authenticity Analyzer - Deployment Guide

## 🚀 Live Demo
- Frontend: [Your Vercel URL]
- Backend API: [Your Hugging Face Space URL]

## Tech Stack
- **Backend**: Flask + Python 3.12, PyTorch, CLIP, OpenCV
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Hosting**: Hugging Face Spaces (Backend) + Vercel (Frontend)
- **ML Models**: CLIP (OpenAI), ELA, Wavelet Analysis

---

## 🐳 Step 1: Deploy Backend to Hugging Face Spaces (Free)

### 1.1 Create Hugging Face Account
- Go to https://huggingface.co/join
- Verify your email

### 1.2 Create a New Space
1. Go to https://huggingface.co/new-space
2. Fill in:
   - **Owner**: Your username
   - **Space name**: `fake-image-detector`
   - **License**: MIT
   - **SDK**: Select **Docker**
   - **Hardware**: CPU basic (Free)
3. Click **Create Space**

### 1.3 Clone Your Space Locally
```bash
git clone https://huggingface.co/spaces/YOUR-USERNAME/fake-image-detector
cd fake-image-detector
```

### 1.4 Copy Required Files
Copy these files from your project to the cloned Space folder:
- `Dockerfile`
- `backend-flask/` (entire folder)

Then rename `hf-space-readme.md` to `README.md` in the Space folder.

### 1.5 Push to Hugging Face
```bash
git add .
git commit -m "Initial deployment"
git push
```

### 1.6 Wait for Build
- Go to your Space: `https://huggingface.co/spaces/YOUR-USERNAME/fake-image-detector`
- Watch the build logs (takes 5-10 minutes first time)
- Once running, your API is at: `https://YOUR-USERNAME-fake-image-detector.hf.space`

### 1.7 Test the API
```bash
curl https://YOUR-USERNAME-fake-image-detector.hf.space/health
```

---

## 🌐 Step 2: Deploy Frontend to Vercel (Free)

### 2.1 Push to GitHub
If not already on GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/fake-image-detector.git
git push -u origin main
```

### 2.2 Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub

### 2.3 Import Project
1. Click **Add New** → **Project**
2. Select your GitHub repo
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-react`
4. Add **Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-USERNAME-fake-image-detector.hf.space`
5. Click **Deploy**

### 2.4 Update CORS on Backend
Add your Vercel URL to allowed origins. In Hugging Face Space settings or update the code:
```
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

---

## ✅ Deployment Checklist

- [ ] Hugging Face account created
- [ ] Space created with Docker SDK
- [ ] Dockerfile and backend-flask/ uploaded
- [ ] Space building successfully
- [ ] API responding at /health endpoint
- [ ] GitHub repo created
- [ ] Vercel account connected to GitHub
- [ ] Frontend deployed with VITE_API_URL set
- [ ] CORS configured for Vercel domain
- [ ] End-to-end test: upload image and get results

---

## 🔧 Troubleshooting

### Build fails on Hugging Face
- Check build logs in the Space
- Ensure Dockerfile syntax is correct
- Memory issues: The free CPU tier has limited RAM

### CORS errors
- Add your Vercel URL to `ALLOWED_ORIGINS` environment variable
- Redeploy the Space after changes

### Model loading timeout
- First request may take 30-60s as CLIP model downloads
- Subsequent requests will be faster

### Frontend can't reach backend
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that the Space is running (not sleeping)
