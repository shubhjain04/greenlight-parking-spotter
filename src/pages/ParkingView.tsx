import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useParkingContext, ParkingSpot as ParkingSpotType } from '@/contexts/ParkingContext';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import SpotDetails from '@/components/SpotDetails';
import StatusBadge from '@/components/StatusBadge';
import { ArrowLeft, Filter, Wifi } from 'lucide-react';
import ParkingSpotGrid from '@/components/ParkingSpotGrid'; // Import the new component

const ParkingView = () => {
  const { lotId } = useParams<{ lotId: string }>();
  const navigate = useNavigate();
  const { 
    spots, 
    lots, 
    selectedSpot, 
    setSelectedSpot,
    refreshData,
    lastUpdated 
  } = useParkingContext();
  
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const lot = lots.find(l => l.id === lotId);
  const lotSpots = spots.filter(s => s.lot === lot?.name);
  
  const filteredSpots = filterType 
    ? lotSpots.filter(s => s.type === filterType || (filterType === 'available' && s.status === 'available'))
    : lotSpots;
  
  useEffect(() => {
    if (!lot) {
      navigate('/');
    }
  }, [lot, navigate]);
  
  const handleSpotClick = (spot: ParkingSpotType) => {
    setSelectedSpot(spot);
  };
  
  const closeSpotDetails = () => {
    setSelectedSpot(null);
  };
  
  const toggleFilter = () => {
    setShowFilter(prev => !prev);
  };
  
  const applyFilter = (type: string | null) => {
    setFilterType(type);
    setShowFilter(false);
  };
  
  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    return `Last updated: ${lastUpdated.toLocaleTimeString()}`;
  };
  
  if (!lot) return null;
  
  return (
    <div className="relative min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30">
        <div className="glassmorphic bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-2 h-9 w-9"
            >
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-lg font-medium">{lot.name}</h1>
              <div className="text-xs text-neutral-500 flex items-center">
                <Wifi size={12} className="mr-1" />
                <span>{formatLastUpdated()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge
              type={lot.availableSpots > 10 ? 'available' : lot.availableSpots > 0 ? 'almost-full' : 'occupied'}
              text={`${lot.availableSpots} available`}
              icon={false}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFilter}
              className="h-9 w-9 border-neutral-200"
            >
              <Filter size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filter dropdown */}
      <AnimatePresence>
        {showFilter && (
          <motion.div 
            className="absolute top-16 right-4 z-40 glassmorphic rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="p-3">
              <div className="text-sm font-medium mb-2">Filter Spots</div>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`w-full justify-start ${filterType === null ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}
                  onClick={() => applyFilter(null)}
                >
                  All Spots
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`w-full justify-start ${filterType === 'available' ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}
                  onClick={() => applyFilter('available')}
                >
                  Available Only
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`w-full justify-start ${filterType === 'handicap' ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}
                  onClick={() => applyFilter('handicap')}
                >
                  Handicapped Spots
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`w-full justify-start ${filterType === 'electric' ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}
                  onClick={() => applyFilter('electric')}
                >
                  Electric Vehicle Spots
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Parking spots grid */}
      <div className="p-4">
        <div className="flex items-center justify-center mb-4">
          <div className="text-sm text-neutral-500">
            Showing {filteredSpots.length} spots out of {lotSpots.length} total
          </div>
        </div>
        
        {/* Replace the old grid with the new ParkingSpotGrid component */}
        <ParkingSpotGrid spots={filteredSpots} />
        
        {/* Legend */}
        <div className="flex justify-center mt-6 gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-green-500 mr-2" />
            <span className="text-xs text-neutral-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-red-500 mr-2" />
            <span className="text-xs text-neutral-600">Occupied</span>
          </div>
        </div>
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
      
      {/* Bottom navigation */}
      <Navigation />
    </div>
  );
};

export default ParkingView;
