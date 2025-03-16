import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Compass, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { useParkingContext } from '@/contexts/ParkingContext';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polygon } from '@react-google-maps/api';
import { toast } from 'sonner';

// Google Maps API configuration
const LOADER_OPTIONS = {
  googleMapsApiKey: 'AIzaSyBHH8XkyThoJi9K5d7zGpUaxn-lEq1oSwU', // Your new API key
  libraries: ['places'] as ['places'], // Correctly typed libraries array
};

// Default center coordinates (Toledo, Ohio)
const DEFAULT_CENTER = { lat: 41.6639, lng: -83.5552 };

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%',
};

// Map styling to match the app's design
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

interface MapProps {
  children?: React.ReactNode;
}

const Map: React.FC<MapProps> = ({ children }) => {
  const { refreshData, lastUpdated, isLoading, lots, selectedLot, setSelectedLot } = useParkingContext();
  const [mapView, setMapView] = useState<'roadmap' | 'satellite'>('roadmap');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(15);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader(LOADER_OPTIONS);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    refreshData();
    toast.info('Refreshing parking data...');
  }, [refreshData]);

  // Toggle between roadmap and satellite view
  const toggleMapView = useCallback(() => {
    setMapView((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'));
  }, []);

  // Zoom in the map
  const zoomIn = useCallback(() => {
    if (map) {
      const currentZoom = map.getZoom() || zoom;
      map.setZoom(currentZoom + 1);
      setZoom(currentZoom + 1);
    }
  }, [map, zoom]);

  // Zoom out the map
  const zoomOut = useCallback(() => {
    if (map) {
      const currentZoom = map.getZoom() || zoom;
      map.setZoom(Math.max(currentZoom - 1, 10));
      setZoom(Math.max(currentZoom - 1, 10));
    }
  }, [map, zoom]);

  // Recenter the map to the default location
  const recenterMap = useCallback(() => {
    if (map) {
      map.panTo(DEFAULT_CENTER);
      setCenter(DEFAULT_CENTER);
      toast.success('Map centered to Toledo, Ohio');
    }
  }, [map]);

  // Format the last updated timestamp
  const formatLastUpdated = useCallback(() => {
    if (!lastUpdated) return 'Not updated yet';
    return `Last updated: ${lastUpdated.toLocaleTimeString()}`;
  }, [lastUpdated]);

  // Handle map load event
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Handle marker click event
  const handleMarkerClick = useCallback(
    (lotId: string) => {
      setSelectedMarker(lotId);
      const lot = lots.find((l) => l.id === lotId);
      if (lot) {
        setSelectedLot(lot);
      }
    },
    [lots, setSelectedLot]
  );

  // Display error message if the map fails to load
  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-100">
        <div className="text-center p-5">
          <h3 className="text-xl font-semibold text-red-500">Error Loading Map</h3>
          <p className="text-neutral-600 mt-2">There was a problem loading Google Maps</p>
          <Button variant="default" onClick={() => window.location.reload()} className="mt-4">
            Reload
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {isLoaded ? (
        <div className="absolute inset-0">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            options={{
              ...mapOptions,
              mapTypeId: mapView,
            }}
            onLoad={onMapLoad}
          >
            {/* Render parking lot markers */}
            {lots.map((lot) => (
              <Marker
                key={lot.id}
                position={{
                  lat: lot.coordinates[1],
                  lng: lot.coordinates[0],
                }}
                onClick={() => handleMarkerClick(lot.id)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: lot.availableSpots > 0 ? '#0A9396' : '#FF6B6B', // Green for available, red for full
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: '#ffffff',
                  scale: 15,
                }}
                label={{
                  text: lot.availableSpots.toString(),
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '12px',
                }}
              />
            ))}

            {/* Selected marker info window */}
            {selectedMarker && (
              <InfoWindow
                position={{
                  lat: lots.find((l) => l.id === selectedMarker)?.coordinates[1] || 0,
                  lng: lots.find((l) => l.id === selectedMarker)?.coordinates[0] || 0,
                }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2">
                  <h3 className="font-semibold text-sm">{lots.find((l) => l.id === selectedMarker)?.name}</h3>
                  <p className="text-xs mt-1">
                    Available:{' '}
                    <span className="font-semibold text-teal">
                      {lots.find((l) => l.id === selectedMarker)?.availableSpots}
                    </span>{' '}
                    / {lots.find((l) => l.id === selectedMarker)?.totalSpots}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="w-16 h-16 rounded-full border-4 border-neutral-200 border-t-teal animate-spin" />
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Button
            variant="ghost"
            size="icon"
            className="glassmorphic h-10 w-10 rounded-full"
            onClick={toggleMapView}
            aria-label="Toggle map view"
          >
            <Layers size={18} className="text-neutral-700 dark:text-neutral-300" />
          </Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Button
            variant="ghost"
            size="icon"
            className="glassmorphic h-10 w-10 rounded-full"
            onClick={zoomIn}
            aria-label="Zoom in"
          >
            <ZoomIn size={18} className="text-neutral-700 dark:text-neutral-300" />
          </Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Button
            variant="ghost"
            size="icon"
            className="glassmorphic h-10 w-10 rounded-full"
            onClick={zoomOut}
            aria-label="Zoom out"
          >
            <ZoomOut size={18} className="text-neutral-700 dark:text-neutral-300" />
          </Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <Button
            variant="ghost"
            size="icon"
            className="glassmorphic h-10 w-10 rounded-full"
            onClick={recenterMap}
            aria-label="Recenter map"
          >
            <Compass size={18} className="text-neutral-700 dark:text-neutral-300" />
          </Button>
        </motion.div>
      </div>

      {/* Floating refresh button */}
      <div className="absolute bottom-20 right-4 z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Button
            variant="default"
            size="icon"
            className="glassmorphic h-12 w-12 rounded-full bg-teal text-white"
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh data"
          >
            <RefreshCw size={20} className={`${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </motion.div>
      </div>

      {/* Last updated indicator */}
      <AnimatePresence>
        {lastUpdated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 left-4 z-20"
          >
            <StatusBadge type="info" text={formatLastUpdated()} className="glassmorphic" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading bar indicator */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 z-50">
          <div className="loading-bar w-full"></div>
        </div>
      )}
    </div>
  );
};

export default Map;
