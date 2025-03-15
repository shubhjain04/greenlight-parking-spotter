import React, { useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useParkingContext } from '@/contexts/ParkingContext';

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%',
};

// Default center (Toledo, Ohio)
const DEFAULT_CENTER = { lat: 41.6639, lng: -83.5552 };

const Map: React.FC = () => {
  const { lots } = useParkingContext();

  // Load the Google Maps JavaScript API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your API key
  });

  // Callback when the map is loaded
  const onMapLoad = useCallback((map: google.maps.Map) => {
    // You can perform additional map setup here if needed
  }, []);

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={DEFAULT_CENTER}
      zoom={14}
      onLoad={onMapLoad}
    >
      {/* Render parking lot markers */}
      {lots.map((lot) => (
        <Marker
          key={lot.id}
          position={{ lat: lot.coordinates[1], lng: lot.coordinates[0] }}
          label={{
            text: lot.availableSpots.toString(),
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '12px',
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: lot.availableSpots > 0 ? '#12b76a' : '#ea384c', // Green if available, red if full
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            scale: 15,
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;
