import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParkingContext } from '@/contexts/ParkingContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Navigation as NavigationIcon } from 'lucide-react';
import Map from '@/components/Map';
import Navigation from '@/components/Navigation';
import StatusBadge from '@/components/StatusBadge';
import { GoogleMap, DirectionsService, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Google Maps API configuration
const LOADER_OPTIONS = {
  googleMapsApiKey: 'AIzaSyBHH8XkyThoJi9K5d7zGpUaxn-lEq1oSwU', // Your new API key
  libraries: ['places'], // Add any additional libraries you need
};

// Default center coordinates (Toledo, Ohio)
const DEFAULT_CENTER = { lat: 41.6639, lng: -83.5552 };

const Directions = () => {
  const navigate = useNavigate();
  const { lots, selectedLot } = useParkingContext();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [destination, setDestination] = useState<google.maps.LatLngLiteral | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader(LOADER_OPTIONS);

  // Set user location and destination
  useEffect(() => {
    if (!lots.length) return; // Exit if no lots are available

    // For demo purposes, set Toledo as the user location
    setUserLocation(DEFAULT_CENTER);

    // Set destination based on selectedLot or the best available lot
    if (selectedLot) {
      setDestination({
        lat: selectedLot.coordinates[1],
        lng: selectedLot.coordinates[0],
      });
    } else {
      const bestLot = lots.reduce((prev, current) =>
        prev.availableSpots > current.availableSpots ? prev : current
      );
      setDestination({
        lat: bestLot.coordinates[1],
        lng: bestLot.coordinates[0],
      });
    }
  }, [selectedLot, lots]);

  // Calculate directions
  const calculateDirections = useCallback(() => {
    if (!userLocation || !destination) {
      toast.error('Origin or destination missing');
      return;
    }

    setIsLoading(true);
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: userLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        } else {
          toast.error(`Directions request failed: ${status}`);
        }
        setIsLoading(false);
      }
    );
  }, [userLocation, destination]);

  // Get estimated travel time
  const getEstimatedTime = () => {
    if (!directions || !directions.routes[0]) return 'Calculating...';

    const route = directions.routes[0];
    const leg = route.legs[0];
    return leg.duration?.text || 'Unknown';
  };

  // Get travel distance
  const getDistance = () => {
    if (!directions || !directions.routes[0]) return 'Calculating...';

    const route = directions.routes[0];
    const leg = route.legs[0];
    return leg.distance?.text || 'Unknown';
  };

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
    <div className="relative h-screen w-full overflow-hidden bg-neutral-50">
      {/* Map container */}
      <div className="absolute inset-0">
        {isLoaded && userLocation && destination && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={userLocation}
            zoom={15}
            options={{
              disableDefaultUI: true,
              zoomControl: false,
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }],
                },
              ],
            }}
          >
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: '#0A9396',
                    strokeWeight: 5,
                    strokeOpacity: 0.8,
                  },
                  suppressMarkers: false,
                }}
              />
            )}
          </GoogleMap>
        )}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 px-4 z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="glassmorphic rounded-xl p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="h-8 w-8 rounded-full"
              >
                <ArrowLeft size={18} />
              </Button>
              <h1 className="text-lg font-medium">Directions</h1>
              <div className="w-8"></div> {/* Spacer for alignment */}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom information card */}
      <div className="absolute bottom-20 left-0 right-0 px-4 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glassmorphic rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">
                {selectedLot ? selectedLot.name : 'Best Available Parking'}
              </h2>
              <StatusBadge
                type={isLoading ? 'warning' : 'success'}
                text={isLoading ? 'Calculating route...' : 'Route found'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/50 rounded-lg p-3">
                <p className="text-xs text-neutral-500">Estimated Time</p>
                <p className="text-lg font-medium">{getEstimatedTime()}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <p className="text-xs text-neutral-500">Distance</p>
                <p className="text-lg font-medium">{getDistance()}</p>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={calculateDirections}
              disabled={isLoading || !userLocation || !destination}
            >
              <NavigationIcon size={16} className="mr-2" />
              Start Navigation
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 bg-neutral-100 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-neutral-200 border-t-teal animate-spin mb-6" />
          <h2 className="text-2xl font-medium text-teal mb-2">Loading Map</h2>
          <p className="text-neutral-500">Please wait...</p>
        </div>
      )}

      {/* Bottom navigation */}
      <Navigation />
    </div>
  );
};

export default Directions;
