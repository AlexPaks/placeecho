import pytest
import json
from app.providers.geocoding_mapbox import MapBoxGeocodingProvider

@pytest.mark.asyncio
async def test_mapbox_normalizer_colosseum():
    provider = MapBoxGeocodingProvider()

    place = await provider.reverse_geocode_normalized(
        lat=41.8902,
        lng=12.4922,
        language="he"
    )

    print("\n===== NORMALIZED RESPONSE =====")
    print(json.dumps(place.model_dump(), indent=2, ensure_ascii=False))
    print("===== END =====\n")

    assert place.place_name is not None