from __future__ import annotations
import httpx
from app.core.config import settings

class OSMGeocodingProvider:
    BASE = "https://nominatim.openstreetmap.org/reverse"

    async def reverse_geocode(self, lat: float, lng: float) -> dict:
        params = {
            "format": "jsonv2",
            "lat": str(lat),
            "lon": str(lng),
            "zoom": "18",
            "addressdetails": "1"
        }
        headers = {"User-Agent": settings.osm_user_agent}
        async with httpx.AsyncClient(timeout=10.0, headers=headers) as client:
            r = await client.get(self.BASE, params=params)
            r.raise_for_status()
            return r.json()
