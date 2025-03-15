
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Compass, ZoomIn, ZoomOut, Map as MapIcon } from 'lucide-react';
import { useParkingContext } from '@/contexts/ParkingContext';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';

interface MapProps {
  children?: React.ReactNode;
}

// This is a placeholder for an actual map implementation
// In a real app, you would integrate with Mapbox, Google Maps, or another map provider
const Map: React.FC<MapProps> = ({ children }) => {
  const { refreshData, lastUpdated, isLoading } = useParkingContext();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapView, setMapView] = useState<'standard' | 'satellite'>('standard');
  const [zoomLevel, setZoomLevel] = useState(15);
  
  const handleRefresh = () => {
    refreshData();
  };
  
  const toggleMapView = () => {
    setMapView(prev => prev === 'standard' ? 'satellite' : 'standard');
  };
  
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 20));
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 10));
  };
  
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Not updated yet';
    return `Last updated: ${lastUpdated.toLocaleTimeString()}`;
  };
  
  return (
    <div className="relative h-full w-full overflow-hidden" ref={mapRef}>
      {/* Map background (placeholder) */}
      <div 
        className="absolute inset-0 transition-opacity duration-500 z-0"
        style={{
          backgroundImage: mapView === 'standard' 
            ? "url('https://maps.googleapis.com/maps/api/staticmap?center=41.658693,-83.606705&zoom=15&size=800x1200&scale=2&maptype=roadmap&style=feature:poi|visibility:off&key=NO_API_KEY_NEEDED_FOR_PLACEHOLDER')" 
            : "url('https://maps.googleapis.com/maps/api/staticmap?center=41.658693,-83.606705&zoom=15&size=800x1200&scale=2&maptype=satellite&key=NO_API_KEY_NEEDED_FOR_PLACEHOLDER')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `brightness(${mapView === 'standard' ? '1' : '0.9'})`,
          transform: `scale(${1 + (zoomLevel - 15) * 0.1})`,
        }}
      />
      
      {/* Map content */}
      <div className="absolute inset-0 z-10">
        {children}
      </div>
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="glassmorphic h-10 w-10 rounded-full"
            onClick={toggleMapView}
          >
            <MapIcon size={18} className="text-neutral-700 dark:text-neutral-300" />
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="glassmorphic h-10 w-10 rounded-full"
            onClick={zoomIn}
          >
            <ZoomIn size={18} className="text-neutral-700 dark:text-neutral-300" />
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="glassmorphic h-10 w-10 rounded-full"
            onClick={zoomOut}
          >
            <ZoomOut size={18} className="text-neutral-700 dark:text-neutral-300" />
          </Button>
        </motion.div>
      </div>
      
      {/* Floating refresh button */}
      <div className="absolute bottom-20 right-4 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="default"
            size="icon"
            className="glassmorphic h-12 w-12 rounded-full bg-teal text-white"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw 
              size={20} 
              className={`${isLoading ? 'animate-spin' : ''}`} 
            />
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
            <StatusBadge
              type="info"
              text={formatLastUpdated()}
              className="glassmorphic"
            />
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
