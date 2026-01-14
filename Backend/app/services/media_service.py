from __future__ import annotations
import uuid
from pathlib import Path
from fastapi import UploadFile
from app.core.config import settings

UPLOAD_DIR = Path("static/uploads")
AUDIO_DIR = Path("static/audio")

def save_audio_bytes(audio_bytes: bytes, ext: str = "mp3") -> str:
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    name = f"{uuid.uuid4()}.{ext}"
    path = AUDIO_DIR / name
    path.write_bytes(audio_bytes)
    return f"{settings.audio_public_base_url}/audio/{name}"

def upload_media(file: UploadFile, media_type: str = "image") -> dict:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    # best effort extension
    ext = "jpg"
    if file.filename and "." in file.filename:
        ext = file.filename.split(".")[-1].lower()

    media_id = str(uuid.uuid4())
    name = f"{media_id}.{ext}"
    path = UPLOAD_DIR / name

    data = file.file.read()
    path.write_bytes(data)

    url = f"{settings.media_public_base_url}/uploads/{name}"
    return {"mediaId": media_id, "url": url, "contentType": file.content_type or "application/octet-stream"}
