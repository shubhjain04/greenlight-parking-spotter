
import React from 'react';
import { motion } from 'framer-motion';
import { X, Navigation, Clock, Info, AlertTriangle, Bell, Car } from 'lucide-react';
import { useParkingContext, ParkingSpot } from '@/contexts/ParkingContext';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';

interface SpotDetailsProps {
  spot: ParkingSpot;
  onClose: () => void;
}

const SpotDetails: React.FC<SpotDetailsProps> = ({ spot, onClose }) => {
  const { reportIncorrectData, subscribeToSpot, unsubscribeFromSpot, subscribedSpots } = useParkingContext();
  
  const isSubscribed = subscribedSpots.includes(spot.id);
  
  const handleSubscribe = async () => {
    if (isSubscribed) {
      await unsubscribeFromSpot(spot.id);
    } else {
      await subscribeToSpot(spot.id);
    }
  };
  
  const handleReportIncorrect = async () => {
    await reportIncorrectData(
      spot.id, 
      spot.status === 'available' ? 'occupied' : 'available'
    );
  };
  
  const formatTimeLimit = (minutes?: number) => {
    if (!minutes) return 'No limit';
    if (minutes < 60) return `${minutes} minutes`;
    return `${minutes / 60} hour${minutes > 60 ? 's' : ''}`;
  };
  
  const formatDistance = (meters?: number) => {
    if (!meters) return 'Unknown';
    if (meters < 1000) return `${meters} meters`;
    return `${(meters / 1000).toFixed(1)} km`;
  };
  
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    
    if (diffMin < 1) return 'Just now';
    if (diffMin === 1) return '1 minute ago';
    if (diffMin < 60) return `${diffMin} minutes ago`;
    
    return date.toLocaleTimeString();
  };
  
  const getSpotTypeName = (type?: string) => {
    switch (type) {
      case 'handicap': return 'Handicapped';
      case 'electric': return 'Electric Vehicle';
      case 'compact': return 'Compact';
      default: return 'Regular';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-x-0 bottom-[72px] mx-auto max-w-sm rounded-2xl overflow-hidden z-30"
    >
      <div className="glassmorphic backdrop-blur-lg border border-white/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Car size={18} className="text-teal mr-2" />
            <h2 className="text-xl font-medium">Spot {spot.spotNumber}</h2>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col">
            <span className="text-neutral-500 text-xs mb-1">Status</span>
            <StatusBadge 
              type={spot.status === 'available' ? 'available' : 'occupied'}
              text={spot.status === 'available' ? 'Available' : 'Occupied'}
              icon={false}
            />
          </div>
          
          <div className="flex flex-col">
            <span className="text-neutral-500 text-xs mb-1">Parking Lot</span>
            <span className="text-sm font-medium">{spot.lot}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-neutral-500 text-xs mb-1">Time Limit</span>
            <span className="text-sm font-medium">{formatTimeLimit(spot.timeLimit)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-neutral-500 text-xs mb-1">Distance</span>
            <span className="text-sm font-medium">{formatDistance(spot.distance)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-neutral-500 text-xs mb-1">Type</span>
            <span className="text-sm font-medium">{getSpotTypeName(spot.type)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-neutral-500 text-xs mb-1">Last Updated</span>
            <span className="text-sm font-medium">{formatLastUpdated(spot.lastUpdated)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="flex items-center gap-1.5 border border-neutral-200"
            onClick={handleReportIncorrect}
          >
            <AlertTriangle size={16} />
            <span>Report Incorrect</span>
          </Button>
          
          <Button 
            variant={isSubscribed ? "destructive" : "default"}
            className={`flex items-center gap-1.5 ${
              isSubscribed 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-teal hover:bg-teal-600'
            }`}
            onClick={handleSubscribe}
          >
            <Bell size={16} />
            <span>{isSubscribed ? 'Unsubscribe' : 'Notify Me'}</span>
          </Button>
        </div>
        
        {spot.status === 'available' && (
          <Button
            className="w-full mt-3 bg-teal hover:bg-teal-600"
          >
            <Navigation size={16} className="mr-1.5" />
            Get Directions
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default SpotDetails;
