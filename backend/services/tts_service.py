from pathlib import Path
import uuid
import edge_tts

AUDIO_DIR = Path(__file__).resolve().parent.parent / "static" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

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
    voice = VOICES.get(voice_id, DEFAULT_VOICE)
    filename = f"{uuid.uuid4().hex}.mp3"
    output_path = AUDIO_DIR / filename

    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(str(output_path))

    return output_path


async def list_available_voices():
    """Return available English US voices from edge-tts."""
    voices = await edge_tts.list_voices()
    return [v for v in voices if v["Locale"] == "en-US"]
