import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParkingContext, ParkingSpot } from '@/contexts/ParkingContext';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import Navigation from '@/components/Navigation';
import SpotDetails from '@/components/SpotDetails';
import Map from '@/components/Map';
import ParkingLotOverview from '@/components/ParkingLotOverview';
import { Compass } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { 
    spots, 
    lots, 
    selectedSpot, 
    setSelectedSpot, 
    selectedLot, 
    setSelectedLot,
    searchQuery 
  } = useParkingContext();
  
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };
  
  const closeSpotDetails = () => {
    setSelectedSpot(null);
  };
  
  const handleLotClick = (lotId: string) => {
    const lot = lots.find(l => l.id === lotId);
    if (lot) {
      setSelectedLot(lot);
      navigate(`/lot/${lotId}`);
    }
  };
  
  return (
    <div className="relative h-screen w-full overflow-hidden bg-neutral-50">
      {/* Map container */}
      <Map />
      
      {/* Floating search bar */}
      <div className="absolute top-4 left-0 right-0 px-4 z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SearchBar placeholder="Enter any building name" />
        </motion.div>
      </div>
      
      {/* Parking lot overview cards */}
      <div className="absolute bottom-24 left-0 right-0 px-4 z-20">
        <div className="flex snap-x snap-mandatory overflow-x-auto pb-4 gap-3 hide-scrollbar">
          {lots.map((lot) => (
            <div key={lot.id} className="snap-center flex-shrink-0 w-64">
              <ParkingLotOverview 
                lot={lot} 
                onClick={() => handleLotClick(lot.id)}
                isSelected={selectedLot?.id === lot.id}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-3"
        >
          <Button
            className="action-button"
            onClick={() => navigate('/directions')}
          >
            <Compass size={16} className="mr-2" />
            Find Nearest Spot
          </Button>
        </motion.div>
      </div>
      
      {/* Spot details panel */}
      <AnimatePresence>
        {selectedSpot && (
          <SpotDetails 
            spot={selectedSpot} 
            onClose={closeSpotDetails}
          />
        )}
      </AnimatePresence>
      
      {/* Loading overlay */}
      <AnimatePresence>
        {!isMapLoaded && (
          <motion.div
            className="absolute inset-0 z-50 bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="w-20 h-20 rounded-full border-4 border-neutral-200 border-t-teal animate-spin mb-6" />
            <h2 className="text-2xl font-medium text-teal mb-2">Parking Spotter</h2>
            <p className="text-neutral-500">Loading parking information...</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom navigation */}
      <Navigation />
    </div>
  );
};

export default Index;
