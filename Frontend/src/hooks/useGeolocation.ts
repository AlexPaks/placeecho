import { useState, useEffect, useCallback } from 'react';
import { LocationData } from '../types';
import config from '../config';

interface GeolocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null
  });
  const API_BASE = config.API_BASE_URL;

  const setLocation = useCallback(async (
    gpsData: { lat: number; lng: number },
    source: 'photo_exif' | 'geolocation'
  ) => {
    if (source === 'photo_exif') {
      console.log('Skipping backend call: location source is photo_exif');
      setState({
        location: {
          latitude: gpsData.lat,
          longitude: gpsData.lng,
          placeName: 'Photo EXIF Location',
          timestamp: Date.now(),
        },
        loading: false,
        error: null,
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/context/from-gps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gpsData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch location context');
      }

      const context = await response.json();
      setState({
        location: {
          latitude: gpsData.lat,
          longitude: gpsData.lng,
          placeName: context.placeName,
          timestamp: Date.now(),
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        location: null,
        loading: false,
        error: 'Failed to fetch location context',
      });
    }
  }, [API_BASE]);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser'
      }));
      return;
    }
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));
    navigator.geolocation.getCurrentPosition(async position => {
      const {
        latitude,
        longitude
      } = position.coords;

      if (config.TEST_MODE) {
        const dummyPlaceName = `Test Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
        setState({
          location: {
            latitude,
            longitude,
            placeName: dummyPlaceName,
            timestamp: Date.now(),
          },
          loading: false,
          error: null,
        });
      } else {
        await setLocation({ lat: latitude, lng: longitude }, 'geolocation');
      }
    }, error => {
      let errorMessage = 'Unable to retrieve your location';
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 'Location permission denied. Please enable location services.';
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = 'Location information is unavailable.';
      } else if (error.code === error.TIMEOUT) {
        errorMessage = 'The request to get user location timed out.';
      }
      setState({
        location: null,
        loading: false,
        error: errorMessage
      });
    });
  }, [setLocation]);

  useEffect(() => {
    navigator.permissions?.query({
      name: 'geolocation'
    }).then(result => {
      if (result.state === 'granted') {
        getLocation();
      }
    });
  }, [getLocation]);

  return {
    ...state,
    refreshLocation: getLocation,
    setLocation, // Expose setLocation for external use
  };
}