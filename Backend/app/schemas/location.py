from __future__ import annotations
from pydantic import BaseModel

class PlaceDescription(BaseModel):
    title: str | None = None          # שם קצר: "Colosseo"
    place_name: str | None = None     # שם מלא: "Colosseo, Piazza..., Roma..."
    category: str | None = None       # אם זה poi: "historic" וכו'
    center_lon: float | None = None
    center_lat: float | None = None

    # address-ish
    street: str | None = None
    house_number: str | None = None
    postcode: str | None = None
    neighborhood: str | None = None
    locality: str | None = None
    city: str | None = None
    region: str | None = None
    country: str | None = None

    # debug / future use
    mapbox_id: str | None = None
