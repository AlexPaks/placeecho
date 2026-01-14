from __future__ import annotations
from app.schemas.context import ContextResponse
from app.schemas.common import Preferences

def generate_story(context: ContextResponse, preferences: Preferences) -> tuple[str, dict]:
    tone = preferences.tone
    place = context.placeName or "somewhere"

    story = (
        f"In a {tone} mood, you arrive at {place}. "
        f"The air carries a hint of mystery, and the streets seem to remember every footstep. "
        f"For a brief moment, the place feels like it’s speaking directly to you."
    )

    # הערכה גסה: 150–180 wpm → ~2.5–3 wps
    estimated_seconds = max(20, min(120, int(len(story.split()) / 2.7)))
    return story, {"estimatedSeconds": estimated_seconds}
