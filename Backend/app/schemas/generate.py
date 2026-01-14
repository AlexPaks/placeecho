from pydantic import BaseModel
from app.schemas.common import Gps, Preferences
from app.schemas.context import ContextResponse

class GenerateRequest(BaseModel):
    gps: Gps | None = None
    imageId: str | None = None
    preferences: Preferences

class GenerateResponse(BaseModel):
    storyText: str
    audioUrl: str
    providerUsed: str | None = None
    cached: bool = False
    context: ContextResponse | None = None
