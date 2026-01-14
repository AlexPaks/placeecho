from fastapi import APIRouter
from app.core.redis_client import get_redis

router = APIRouter()

@router.get("/ping")
def ping():
    r = get_redis()
    return {"redis": r.ping()}

@router.get("/get")
def get(key: str):
    r = get_redis()
    return {"key": key, "value": r.get(key)}
