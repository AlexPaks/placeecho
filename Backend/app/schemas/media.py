from pydantic import BaseModel

class MediaUploadResponse(BaseModel):
    mediaId: str
    url: str
    contentType: str
