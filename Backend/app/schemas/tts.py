from pydantic import BaseModel, Field

class TtsRequest(BaseModel):
    text: str
    language: str = Field(default="en-US")
    voiceProfile: str = Field(default="marin")
    format: str = Field(default="mp3")
    provider: str = Field(default="openai")

class TtsResponse(BaseModel):
    audioUrl: str
    providerUsed: str
    cached: bool = False
    durationMs: int | None = None
