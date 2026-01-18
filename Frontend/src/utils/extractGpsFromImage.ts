import exifr from 'exifr';

export async function extractGpsFromImage(file: File): Promise<{ lat: number; lng: number } | null> {
  try {
    const gpsData = await exifr.gps(file);
    if (gpsData && gpsData.latitude && gpsData.longitude) {
      return { lat: gpsData.latitude, lng: gpsData.longitude };
    }
    console.warn('No GPS data found in the image.');
    return null;
  } catch (error) {
    console.error('Error extracting GPS data:', error);
    return null;
  }
}