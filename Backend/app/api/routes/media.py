from fastapi import APIRouter, UploadFile, File
from app.schemas.media import MediaUploadResponse
from app.services.media_service import upload_media

router = APIRouter()

@router.post("/upload", response_model=MediaUploadResponse)
def upload(file: UploadFile = File(...), type: str = "image"):
    res = upload_media(file, type)
    return MediaUploadResponse(**res)
