from pydantic import BaseModel
from app.schemas.context import ContextResponse
from app.schemas.common import Preferences

class StoryRequest(BaseModel):
    context: ContextResponse
    preferences: Preferences

class StoryResponse(BaseModel):
    storyText: str
    estimatedSeconds: int
