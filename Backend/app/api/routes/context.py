from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from app.schemas.common import Gps
from app.schemas.context import ContextResponse
from app.services.context_service import resolve_from_gps, resolve_from_image

router = APIRouter()

@router.post("/from-gps", response_model=ContextResponse)
def from_gps(gps: Gps):
    return resolve_from_gps(gps)

@router.post("/from-image", response_model=ContextResponse)
def from_image(file: UploadFile = File(...)):
    return resolve_from_image(file)

@router.options("/from-gps")
def options_from_gps():
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
    return JSONResponse(content={}, status_code=200, headers=headers)
