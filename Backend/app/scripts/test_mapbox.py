import pytest
from app.providers.geocoding_mapbox import MapBoxGeocodingProvider
import inspect
from app.core.config import settings

# def test_where_settings_loaded_from():
#     print("Settings class:", type(settings))
#     print("Settings module:", type(settings).__module__)
#     print("Config file:", inspect.getfile(type(settings)))
#     print("Has mapbox_api_key:", hasattr(settings, "mapbox_api_key"))

@pytest.mark.asyncio
async def test_reverse_geocode_colosseum():
    provider = MapBoxGeocodingProvider()

    data = await provider.reverse_geocode(
        lat=41.8902,
        lng=12.4922
    )
    print("Data:", data)
    assert "features" in data
    assert len(data["features"]) > 0

    feature = data["features"][0]
    assert feature["text"] is not None
    assert "place_name" in feature
