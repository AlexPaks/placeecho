import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")

    audio_public_base_url: str = os.getenv("AUDIO_PUBLIC_BASE_URL", "http://localhost:8000/static")
    media_public_base_url: str = os.getenv("MEDIA_PUBLIC_BASE_URL", "http://localhost:8000/static")

    geocoding_provider: str = os.getenv("GEOCODING_PROVIDER", "osm")
    osm_user_agent: str = os.getenv("OSM_USER_AGENT", "PlaceEchoDev/0.1")
    google_maps_api_key: str = os.getenv("GOOGLE_MAPS_API_KEY", "")

    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    tts_cache_ttl_seconds: int = int(os.getenv("TTS_CACHE_TTL_SECONDS", "604800"))

    frontend_origin: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

settings = Settings()
