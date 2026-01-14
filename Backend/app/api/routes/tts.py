from fastapi import APIRouter
from app.schemas.tts import TtsRequest, TtsResponse
from app.services.tts_orchestrator import generate_tts

router = APIRouter()

@router.post("/generate", response_model=TtsResponse)
def tts(req: TtsRequest):
    # כאן נשתמש רק בשדות שמעניינים אותנו ב-MVP
    result = generate_tts(req.text, preferences=req)  # duck-typing על voiceProfile/format
    return TtsResponse(
        audioUrl=result["audioUrl"],
        providerUsed=result["providerUsed"],
        cached=result.get("cached", False),
        durationMs=result.get("durationMs"),
    )
