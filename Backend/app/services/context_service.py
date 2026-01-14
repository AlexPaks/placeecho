from __future__ import annotations
from pathlib import Path
import uuid
from fastapi import UploadFile

from app.core.config import settings
from app.schemas.common import Gps
from app.schemas.context import ContextResponse
from app.providers.geocoding_osm import OSMGeocodingProvider
from app.providers.geocoding_google import GoogleGeocodingProvider
from app.utils.exif_gps import extract_gps_from_image_path

TMP_DIR = Path("static/tmp")
TMP_DIR.mkdir(parents=True, exist_ok=True)

def _get_geocoder():
    if settings.geocoding_provider == "google":
        return GoogleGeocodingProvider()
    return OSMGeocodingProvider()

def resolve_context(gps: Gps | None, image_id: str | None) -> ContextResponse:
    if gps:
        return resolve_from_gps(gps)
    # image_id כאן עדיין לא מחובר ל-storage metadata (אפשר להוסיף DB בהמשך)
    return ContextResponse(placeName="Unknown place", confidence=0.2, source="unknown")

def resolve_from_gps(gps: Gps) -> ContextResponse:
    geocoder = _get_geocoder()
    raw = geocoder.reverse_geocode(gps.lat, gps.lng)

    # normalize
    if settings.geocoding_provider == "google":
        # Google response structure
        results = raw.get("results", [])
        formatted = results[0].get("formatted_address") if results else None
        return ContextResponse(
            placeName=formatted or f"{gps.lat:.4f},{gps.lng:.4f}",
            city=_find_google_component(results, "locality"),
            country=_find_google_component(results, "country"),
            poi=_find_google_component(results, "point_of_interest"),
            confidence=0.75 if formatted else 0.5,
            source="gps"
        )

    # OSM Nominatim structure
    address = raw.get("address", {}) or {}
    display = raw.get("display_name")
    city = address.get("city") or address.get("town") or address.get("village")
    country = address.get("country")
    poi = address.get("attraction") or address.get("museum") or address.get("amenity")

    return ContextResponse(
        placeName=display or f"{gps.lat:.4f},{gps.lng:.4f}",
        city=city,
        country=country,
        poi=poi,
        confidence=0.75 if display else 0.5,
        source="gps"
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
