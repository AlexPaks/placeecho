from pydantic import BaseModel, Field

class Gps(BaseModel):
    lat: float
    lng: float

class Preferences(BaseModel):
    language: str = Field(default="en-US")
    tone: str = Field(default="cinematic")
    audience: str = Field(default="adults")
    lengthSeconds: int = Field(default=60, ge=15, le=180)
    voiceProfile: str = Field(default="marin")
