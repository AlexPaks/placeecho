from __future__ import annotations
import httpx
from app.core.config import settings
from app.providers.mapbox_normalizer import normalize_mapbox_reverse_geocode
from app.schemas.location import PlaceDescription

class MapBoxGeocodingProvider:
    BASE = "https://api.mapbox.com/geocoding/v5/mapbox.places/"

    async def reverse_geocode(self, lat: float, lng: float) -> dict:
        if not settings.mapbox_api_key:
            raise RuntimeError("MAPBOX_API_KEY is missing")
        params = {
            "access_token": settings.mapbox_api_key,
            "types": "poi,address,neighborhood,locality,place,region,country",
            "proximity": f"{lng},{lat}",
            "limit": 1
        }
        url = f"{self.BASE}{lng},{lat}.json"
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(url, params=params)
            r.raise_for_status()
            return r.json()
        
    async def reverse_geocode_normalized(self, lat: float, lng: float, language: str = "he") -> PlaceDescription:
        raw = await self.reverse_geocode(lat=lat, lng=lng)
        return normalize_mapbox_reverse_geocode(raw)    