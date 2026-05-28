# NaturalReader Mini Clone

A minimal working clone of [NaturalReader](https://www.naturalreaders.com/) with AI-powered text-to-speech.

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

## Features

- Type or paste text and generate speech
- Upload PDF files for text extraction
- Voice selector UI (single backend model in v1)
- Audio playback with progress tracking
- Responsive NaturalReader-inspired UI

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/tts` | Generate speech, returns audio URL |
| POST | `/api/tts/stream` | Generate speech, returns WAV file |
| POST | `/api/extract-pdf` | Extract text from uploaded PDF |
