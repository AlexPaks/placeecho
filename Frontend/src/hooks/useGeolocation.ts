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
        // Dummy API response for test mode
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
        // Real API call
        try {
          // Ensure the timestamp is included in the location data
          const response = await fetch(`${config.API_BASE_URL}/context/from-gps`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch location context');
          }

          const context = await response.json();
          setState({
            location: {
              latitude,
              longitude,
              placeName: context.placeName,
              timestamp: Date.now(), // Add current timestamp
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
  }, []);

  // Initial load
  useEffect(() => {
    // Don't auto-load on mount to respect user privacy until requested
    // or if we already have permission
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
    refreshLocation: getLocation
  };
}