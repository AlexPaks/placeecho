from __future__ import annotations
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

def _to_deg(value):
    # value may be tuple of rationals; Pillow gives (num,den) or float-like
    d, m, s = value
    def conv(x):
        if isinstance(x, tuple):
            return x[0] / x[1]
        return float(x)
    return conv(d) + conv(m)/60.0 + conv(s)/3600.0

def extract_gps_from_image_path(path: str) -> tuple[float, float] | None:
    img = Image.open(path)
    exif = img._getexif() or {}
    exif_data = {TAGS.get(k, k): v for k, v in exif.items()}

    gps_info = exif_data.get("GPSInfo")
    if not gps_info:
        return None

    gps = {GPSTAGS.get(k, k): v for k, v in gps_info.items()}

    lat = gps.get("GPSLatitude")
    lat_ref = gps.get("GPSLatitudeRef")
    lng = gps.get("GPSLongitude")
    lng_ref = gps.get("GPSLongitudeRef")

    if not (lat and lat_ref and lng and lng_ref):
        return None

    lat_deg = _to_deg(lat)
    lng_deg = _to_deg(lng)

    if lat_ref.upper() == "S":
        lat_deg = -lat_deg
    if lng_ref.upper() == "W":
        lng_deg = -lng_deg

    return (lat_deg, lng_deg)
