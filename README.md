# Text To Speech

A NaturalReader-inspired text-to-speech web app with AI-powered speech generation.

## Tech Stack

- **Backend:** Python, FastAPI, Edge TTS (Microsoft), PyPDF
- **Frontend:** React, Tailwind CSS, Axios
- **Audio:** Web Audio API, Blob URLs

## Quick Start
 
### Backend

```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 800
```

**Note:** Port `8000` is blocked or already used on your machine (WinError 10013). This project uses port **800** instead. The frontend proxy is already configured for it.

Or run: `.\run.ps1` from the `backend` folder.

Edge TTS uses Microsoft's free online TTS API — no large model downloads needed.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser. The Vite dev server proxies `/api` requests to the backend on port **800**.

## Production (Docker)

Build and run a single container that serves the React UI and FastAPI backend:

```bash
docker build -t text-to-speech .
docker run --rm -p 8000:8000 text-to-speech
```

Open http://localhost:8000. Set `PORT` if your platform assigns a non-default port (for example `-e PORT=8080`). Optional: `CORS_ORIGINS` as a comma-separated list when the frontend is hosted on another origin.

## Deploy free (no payment)

This app ships as one Docker image (React UI + FastAPI). **Render** offers a free web service tier: no credit card, HTTPS, and deploys from GitHub. Good for demos and personal projects.

**Limits on Render Free:** the app sleeps after ~15 minutes without traffic (first request after that can take ~1 minute), and you get 750 instance hours per month per workspace. See [Render free tier docs](https://render.com/docs/free).

### Option A — Blueprint (recommended)

1. Push this repo to GitHub (`swapnilswami332/Text-to-speech`).
2. Sign up at [render.com](https://render.com) (GitHub login is fine).
3. Open **[Create Blueprint from repo](https://dashboard.render.com/blueprint/new)** and select `Text-to-speech`.
4. Render reads the root `render.yaml`, creates a **Free** Docker web service, and deploys.
5. When the deploy finishes, open the `*.onrender.com` URL from the dashboard.

After the service exists, every push to `main` redeploys automatically.

### Option B — Manual web service

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service** → connect this GitHub repo.
2. **Runtime:** Docker · **Instance type:** Free · **Health check path:** `/api/health`
3. Create the service and wait for the first deploy.

### Notes

- Edge TTS needs outbound internet from the server (Render provides this).
- Do not add a payment method on Render unless you want paid overages; stay on the **Free** instance type.
- For local Docker testing, use the **Production (Docker)** section above.

## Features

- Type or paste text and generate speech
- Upload PDF files for text extraction
- Voice selector UI with multiple voices
- Audio playback with progress tracking, pause/resume, and 5-second skip
- Responsive NaturalReader-inspired UI

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/tts` | Generate speech, returns audio URL |
| POST | `/api/tts/stream` | Generate speech, returns audio file |
| POST | `/api/extract-pdf` | Extract text from uploaded PDF |
