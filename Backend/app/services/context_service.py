from __future__ import annotations
from pathlib import Path
import uuid
from fastapi import UploadFile

from app.core.config import settings
from app.schemas.common import Gps
from app.schemas.context import ContextResponse
from app.providers.geocoding_osm import OSMGeocodingProvider
from app.providers.geocoding_google import GoogleGeocodingProvider
from app.providers.geocoding_mapbox import MapBoxGeocodingProvider
from app.utils.exif_gps import extract_gps_from_image_path

TMP_DIR = Path("static/tmp")
TMP_DIR.mkdir(parents=True, exist_ok=True)

def _get_geocoder():
    if settings.geocoding_provider == "google":
        return GoogleGeocodingProvider()
    if settings.geocoding_provider == "mapbox":
        return MapBoxGeocodingProvider()
    return OSMGeocodingProvider()

def resolve_context(gps: Gps | None, image_id: str | None) -> ContextResponse:
    if gps:
        return resolve_from_gps(gps)
    # image_id כאן עדיין לא מחובר ל-storage metadata (אפשר להוסיף DB בהמשך)
    return ContextResponse(placeName="Unknown place", confidence=0.2, source="unknown")

async def resolve_from_gps(gps: Gps) -> ContextResponse:
    geocoder = _get_geocoder()
    raw = await geocoder.reverse_geocode(gps.lat, gps.lng)

    # normalize
    if settings.geocoding_provider == "google":
        # Google response structure
        results = raw.get("results", [])
        formatted = results[0].get("formatted_address") if results else None
        return ContextResponse(
            placeName=formatted or f"{gps.lat:.4f},{gps.lng:.4f}",
            confidence=0.9,
            source="google"
        )
    elif settings.geocoding_provider == "mapbox":
        # MapBox response structure
        features = raw.get("features", [])
        place_name = features[0].get("place_name") if features else None
        return ContextResponse(
            placeName=place_name or f"{gps.lat:.4f},{gps.lng:.4f}",
            confidence=0.8,
            source="mapbox"
        )
    else:
        # OSM response structure
        address = raw.get("address", {})
        place_name = address.get("display_name")
        return ContextResponse(
            placeName=place_name or f"{gps.lat:.4f},{gps.lng:.4f}",
            confidence=0.7,
            source="osm"
        )

def resolve_from_image(file: UploadFile) -> ContextResponse:
    # save temporarily so Pillow can read EXIF
    ext = "jpg"
    if file.filename and "." in file.filename:
        ext = file.filename.split(".")[-1].lower()
    tmp_path = TMP_DIR / f"{uuid.uuid4()}.{ext}"
    tmp_path.write_bytes(file.file.read())

    gps = extract_gps_from_image_path(str(tmp_path))
    if gps:
        lat, lng = gps
        return resolve_from_gps(Gps(lat=lat, lng=lng)).model_copy(update={"source": "exif"})

    # no EXIF → return low confidence (later: vision fallback or ask user)
    return ContextResponse(placeName="Unknown (no EXIF GPS)", confidence=0.25, source="exif")
    
def _find_google_component(results: list, component_type: str) -> str | None:
    for r in results or []:
        for c in r.get("address_components", []) or []:
            if component_type in (c.get("types") or []):
                return c.get("long_name")
    return None

def _find_mapbox_component(features: list, component_type: str) -> str | None:
    for f in features or []:
        if component_type == "locality":
            return f.get("text")
        if component_type == "country":
            return f.get("properties", {}).get("country")
        if component_type == "point_of_interest":
            return f.get("text")
    return None

class ContextService:
    def __init__(self):
        self.mapbox_provider = MapBoxGeocodingProvider()

    def get_context_from_coordinates(self, lat: float, lng: float) -> dict:
        # Use MapBox provider to get context
        return self.mapbox_provider.reverse_geocode(lat, lng)
