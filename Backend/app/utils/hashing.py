import hashlib
import json
from typing import Any

def stable_hash(payload: dict[str, Any]) -> str:
    # consistent json ordering
    dumped = json.dumps(payload, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(dumped.encode("utf-8")).hexdigest()
