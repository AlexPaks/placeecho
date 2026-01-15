from __future__ import annotations
from typing import Any
from app.schemas.location import PlaceDescription

def _ctx_lookup(feature: dict[str, Any], prefix: str) -> str | None:
    """
    Mapbox 'context' items have ids like:
    - 'neighborhood.xxx'
    - 'locality.xxx'
    - 'place.xxx' (city)
    - 'region.xxx'
    - 'country.xxx'
    - 'postcode.xxx'
    """
    for item in (feature.get("context") or []):
        _id = item.get("id", "")
        if _id.startswith(prefix + "."):
            return item.get("text")
    return None

def normalize_mapbox_reverse_geocode(data: dict[str, Any]) -> PlaceDescription:
    features = data.get("features") or []
    if not features:
        return PlaceDescription()

    f0 = features[0]

    center = f0.get("center") or [None, None]  # [lon, lat]
    center_lon = center[0] if len(center) > 0 else None
    center_lat = center[1] if len(center) > 1 else None

    # "properties" varies by feature type; poi has category sometimes
    props = f0.get("properties") or {}
    category = props.get("category")

    # Address fields:
    # - feature['address'] can be house number for address features
    # - feature['text'] may be street name or POI name depending on type
    house_number = f0.get("address")
    street = None
    if "address" in f0:
        # For address features, text is usually the street name
        street = f0.get("text")

    return PlaceDescription(
        title=f0.get("text"),
        place_name=f0.get("place_name"),
        category=category,
        center_lon=center_lon,
        center_lat=center_lat,

        street=street,
        house_number=house_number,
        postcode=_ctx_lookup(f0, "postcode"),
        neighborhood=_ctx_lookup(f0, "neighborhood"),
        locality=_ctx_lookup(f0, "locality"),
        city=_ctx_lookup(f0, "place"),
        region=_ctx_lookup(f0, "region"),
        country=_ctx_lookup(f0, "country"),

        mapbox_id=f0.get("id"),
    )
