from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import redis
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.request_logging import request_logger
from app.api.routes.generate import router as generate_router
from app.api.routes.context import router as context_router
from app.api.routes.story import router as story_router
from app.api.routes.tts import router as tts_router
from app.api.routes.media import router as media_router
from app.api.routes.debug_cache import router as debug_cache_router
from app.core.config import settings

app = FastAPI(title="PlaceEcho API", version="0.1.0")


# logs with correlation id
app.middleware("http")(request_logger)

# serve /static/audio/*.mp3
app.mount("/static", StaticFiles(directory="static"), name="static")

# Add CORS middleware to allow frontend requests
origins = [
    settings.FRONTEND_ORIGIN,  # Frontend development server
    "http://localhost:5173",  # Additional fallback for localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CustomCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = settings.FRONTEND_ORIGIN
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response

app.add_middleware(CustomCORSMiddleware)

@app.get("/health")
def health():
    return {"status": "ok"}

redis = redis.asyncio.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)
@app.get("/health/redis")
async def redis_health():
    await redis.ping()
    return {"redis": "ok"}


app.include_router(generate_router, prefix="/generate", tags=["generate"])
app.include_router(context_router, prefix="/context", tags=["context"])
app.include_router(story_router, prefix="/story", tags=["story"])
app.include_router(tts_router, prefix="/tts", tags=["tts"])
app.include_router(media_router, prefix="/media", tags=["media"])
app.include_router(debug_cache_router, prefix="/debug/cache", tags=["debug"])
