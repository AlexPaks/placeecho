from __future__ import annotations
import httpx
from app.core.config import settings

class GoogleGeocodingProvider:
    BASE = "https://maps.googleapis.com/maps/api/geocode/json"

    async def reverse_geocode(self, lat: float, lng: float) -> dict:
        if not settings.google_maps_api_key:
            raise RuntimeError("GOOGLE_MAPS_API_KEY is missing")
        params = {
            "latlng": f"{lat},{lng}",
            "key": settings.google_maps_api_key
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(self.BASE, params=params)
            r.raise_for_status()
            return r.json()
