from pydantic import BaseModel

class ContextResponse(BaseModel):
    placeName: str | None = None
    city: str | None = None
    country: str | None = None
    poi: str | None = None
    confidence: float = 0.5
    source: str = "gps"  # gps|exif|vision
