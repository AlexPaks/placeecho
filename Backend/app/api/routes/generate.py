from fastapi import APIRouter
from app.schemas.generate import GenerateRequest, GenerateResponse
from app.services.context_service import resolve_context
from app.services.story_service import generate_story
from app.services.tts_orchestrator import generate_tts

router = APIRouter()

@router.post("", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    ctx = resolve_context(req.gps, req.imageId)
    story_text, meta = generate_story(ctx, req.preferences)
    audio = generate_tts(story_text, req.preferences)

    return GenerateResponse(
        storyText=story_text,
        audioUrl=audio["audioUrl"],
        providerUsed=audio.get("providerUsed"),
        cached=audio.get("cached", False),
        context=ctx
    )
