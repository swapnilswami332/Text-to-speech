# TTS backend - use port 800 (8000 is blocked/in use on this machine)
python -m uvicorn main:app --reload --host 127.0.0.1 --port 800
