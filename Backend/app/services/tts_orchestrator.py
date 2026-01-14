from __future__ import annotations
import json
from app.providers.tts_openai import OpenAITTSProvider
from app.services.media_service import save_audio_bytes
from app.core.redis_client import get_redis
from app.core.config import settings
from app.utils.hashing import stable_hash

_provider: OpenAITTSProvider | None = None

def _get_provider() -> OpenAITTSProvider:
    global _provider
    if _provider is None:
        _provider = OpenAITTSProvider()
    return _provider

def generate_tts(text: str, preferences) -> dict:
    voice = getattr(preferences, "voiceProfile", "marin") or "marin"
    fmt = getattr(preferences, "format", "mp3") or "mp3"
    lang = getattr(preferences, "language", "en-US") or "en-US"

    cache_key = "tts:" + stable_hash({
        "text": text,
        "voice": voice,
        "language": lang,
        "format": fmt,
        "provider": "openai",
        "model": "tts-1",
    })

    r = get_redis()
    cached = r.get(cache_key)
    if cached:
        return json.loads(cached) | {"cached": True}

    provider = _get_provider()
    audio_bytes = provider.synthesize(text=text, voice=voice, model="tts-1", fmt=fmt)

    ext = "mp3" if fmt == "mp3" else "wav"
    audio_url = save_audio_bytes(audio_bytes, ext=ext)

    payload = {"audioUrl": audio_url, "providerUsed": "openai", "cached": False}
    r.setex(cache_key, settings.tts_cache_ttl_seconds, json.dumps(payload))
    return payload
