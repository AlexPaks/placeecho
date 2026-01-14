from __future__ import annotations
from openai import OpenAI
from app.core.config import settings

class OpenAITTSProvider:
    def __init__(self) -> None:
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is missing in environment")
        self.client = OpenAI(api_key=settings.openai_api_key)

    def synthesize(self, *, text: str, voice: str, model: str = "tts-1", fmt: str = "mp3") -> bytes:
        # OpenAI Python SDK TTS
        resp = self.client.audio.speech.create(
            model=model,
            voice=voice,
            input=text,
            format=fmt,  # אם אצלך ב-SDK אין 'format', תסיר שורה זו
        )

        # safe read
        if hasattr(resp, "read") and callable(resp.read):
            return resp.read()

        # fallback
        return bytes(resp)
