/**
 * Google Maps configuration
 */

// Google Maps API key (demo key for development purposes only)
export const GOOGLE_MAPS_API_KEY = 'AIzaSyDWbWY1DNOBkUl9A-DEGXLCi5wqCK0gGQI';

// Default center coordinates (Toledo, OH)
export const DEFAULT_CENTER = {
  lat: 41.6528,
  lng: -83.5379
};

// Default map styling
export const MAP_STYLES = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  }
];

// Loader options for consistent initialization across components
export const LOADER_OPTIONS = {
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['places'] as ['places'], // Explicitly type as a tuple of allowed libraries
};
