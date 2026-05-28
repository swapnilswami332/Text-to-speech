from pathlib import Path
import json
import uuid
import asyncio
import edge_tts

AUDIO_DIR = Path(__file__).resolve().parent.parent / "static" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
DEBUG_LOG = Path(__file__).resolve().parent.parent.parent / "debug-f6b55d.log"

VOICES = {
    "adam": "en-US-GuyNeural",
    "evelyn": "en-US-JennyNeural",
    "derek": "en-US-ChristopherNeural",
    "lola": "en-US-AriaNeural",
    "lewis": "en-US-BrianNeural",
    "ava": "en-US-AnaNeural",
}

DEFAULT_VOICE = "en-US-GuyNeural"


async def synthesize(text: str, voice_id: str = "adam") -> Path:
    """Synthesize text and return the path to the generated MP3 file."""
    # #region agent log
    with DEBUG_LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps({
            "sessionId": "f6b55d",
            "hypothesisId": "lewis-voice",
            "location": "services/tts_service.py:synthesize",
            "message": "resolve voice",
            "data": {"voice_id": voice_id, "edge_voice": VOICES.get(voice_id, DEFAULT_VOICE), "text_len": len(text)},
            "timestamp": __import__("time").time_ns() // 1_000_000,
        }) + "\n")
    # #endregion
    voice = VOICES.get(voice_id, DEFAULT_VOICE)
    filename = f"{uuid.uuid4().hex}.mp3"
    output_path = AUDIO_DIR / filename

    communicate = edge_tts.Communicate(text, voice)
    try:
        await communicate.save(str(output_path))
    except Exception as exc:
        # #region agent log
        with DEBUG_LOG.open("a", encoding="utf-8") as f:
            f.write(json.dumps({
                "sessionId": "f6b55d",
                "hypothesisId": "lewis-voice",
                "location": "services/tts_service.py:synthesize",
                "message": "tts failed",
                "data": {"voice_id": voice_id, "edge_voice": voice, "error": type(exc).__name__, "detail": str(exc)},
                "timestamp": __import__("time").time_ns() // 1_000_000,
            }) + "\n")
        # #endregion
        raise

    return output_path


async def list_available_voices():
    """Return available English US voices from edge-tts."""
    voices = await edge_tts.list_voices()
    return [v for v in voices if v["Locale"] == "en-US"]
