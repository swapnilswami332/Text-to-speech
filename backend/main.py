import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response
from pathlib import Path
from pydantic import BaseModel
import shutil

from services.tts_service import synthesize, VOICES
from services.pdf_service import extract_text_from_pdf
from services.text_cleaner import clean_text, chunk_text

app = FastAPI(title="NaturalReader Mini Clone API")

_cors_origins = os.environ.get("CORS_ORIGINS", "*")
_origins = [o.strip() for o in _cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials="*" not in _origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path(__file__).parent / "static"
(STATIC_DIR / "audio").mkdir(parents=True, exist_ok=True)

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

SPA_DIR = Path(__file__).parent / "spa"


class TTSRequest(BaseModel):
    text: str
    voice_id: str = "adam"


class TTSResponse(BaseModel):
    audio_url: str
    chunks_count: int


class ExtractResponse(BaseModel):
    text: str
    pages: int


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/voices")
def get_voices():
    return [
        {"id": k, "edge_voice": v}
        for k, v in VOICES.items()
    ]


@app.post("/api/tts", response_model=TTSResponse)
async def text_to_speech(req: TTSRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    cleaned = clean_text(req.text)
    chunks = chunk_text(cleaned)

    all_paths: list[Path] = []
    for chunk in chunks:
        if chunk.strip():
            path = await synthesize(chunk, req.voice_id)
            all_paths.append(path)

    if not all_paths:
        raise HTTPException(status_code=500, detail="TTS generation failed")

    primary = all_paths[0]
    audio_url = f"/static/audio/{primary.name}"
    return TTSResponse(audio_url=audio_url, chunks_count=len(all_paths))


@app.post("/api/tts/stream")
async def text_to_speech_file(req: TTSRequest):
    """Return the audio file directly as an audio response."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    cleaned = clean_text(req.text)

    if not cleaned.strip():
        raise HTTPException(status_code=400, detail="No valid text to synthesize")

    path = await synthesize(cleaned, req.voice_id)
    return Response(content=path.read_bytes(), media_type="audio/mpeg")


@app.post("/api/extract-pdf", response_model=ExtractResponse)
async def extract_pdf(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    save_path = UPLOAD_DIR / file.filename
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        from pypdf import PdfReader
        reader = PdfReader(str(save_path))
        pages_count = len(reader.pages)
        text = extract_text_from_pdf(save_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {str(e)}")
    finally:
        save_path.unlink(missing_ok=True)

    return ExtractResponse(text=text, pages=pages_count)


app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

if SPA_DIR.is_dir():
    app.mount("/", StaticFiles(directory=str(SPA_DIR), html=True), name="spa")
