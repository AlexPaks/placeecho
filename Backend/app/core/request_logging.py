import time
import uuid
from fastapi import Request

async def request_logger(request: Request, call_next):
    rid = str(uuid.uuid4())[:8]
    start = time.time()
    response = await call_next(request)
    ms = int((time.time() - start) * 1000)
    print(f"[{rid}] {request.method} {request.url.path} -> {response.status_code} ({ms}ms)")
    return response
