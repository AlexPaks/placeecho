import os
DRY_RUN = os.getenv("TTS_DRY_RUN", "false").lower() == "true"
