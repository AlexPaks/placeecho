import config from "../config";

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const API_BASE =config.API_BASE_URL;
    const response = await fetch(`${API_BASE}/context/from-gps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lng }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch location context');
    }

    const context = await response.json();
    return context.placeName || null;
  } catch (error) {
    console.error('Error reverse-geocoding coordinates:', error);
    return null;
  }
}