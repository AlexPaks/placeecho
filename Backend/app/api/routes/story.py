from fastapi import APIRouter
from app.schemas.story import StoryRequest, StoryResponse
from app.services.story_service import generate_story

router = APIRouter()

@router.post("/generate", response_model=StoryResponse)
def story(req: StoryRequest):
    text, meta = generate_story(req.context, req.preferences)
    return StoryResponse(storyText=text, estimatedSeconds=meta["estimatedSeconds"])
