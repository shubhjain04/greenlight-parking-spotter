
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParkingContext, ParkingSpot as ParkingSpotType } from '@/contexts/ParkingContext';

interface ParkingSpotProps {
  spot: ParkingSpotType;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  isSelected?: boolean;
}

const ParkingSpot: React.FC<ParkingSpotProps> = ({
  spot,
  onClick,
  size = 'md',
  isSelected = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { subscribedSpots } = useParkingContext();
  
  const isSubscribed = subscribedSpots.includes(spot.id);
  
  const sizeClasses = {
    sm: 'w-5 h-8',
    md: 'w-6 h-10',
    lg: 'w-8 h-14',
  };
  
  const getSpotTypeIcon = () => {
    switch (spot.type) {
      case 'handicap':
        return (
          <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
            <path d="M12 2a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2c0-1.1.9-2 2-2zm8 7h-5v12c0 .6-.4 1-1 1a1 1 0 01-1-1v-5h-2v5a1 1 0 01-1 1 1 1 0 01-1-1V9H4a1 1 0 01-1-1 1 1 0 011-1h16c.6 0 1 .4 1 1s-.4 1-1 1z" />
          </svg>
        );
      case 'electric':
        return (
          <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
            <path d="M14.5 11L12 7.5 9.5 11H11v2H6V7h2V5H6a2 2 0 00-2 2v6a2 2 0 002 2h5v2.5l2.5-3.5 2.5 3.5V15h5a2 2 0 002-2V7a2 2 0 00-2-2h-2v2h2v6h-5v-2h1.5z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      className={`relative ${sizeClasses[size]} rounded-md cursor-pointer mx-0.5 transition-transform duration-300`}
      style={{
        backgroundColor: spot.status === 'available' ? '#12b76a' : '#ea384c',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: isSelected ? 1.1 : 1,
        boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 4px #0A9396' : 'none',
      }}
      transition={{
        layout: { type: 'spring', stiffness: 200, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      {/* Spot Type Indicator */}
      {spot.type !== 'regular' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {getSpotTypeIcon()}
        </div>
      )}
      
      {/* Notification Badge */}
      {isSubscribed && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse-teal" />
      )}
      
      {/* Tooltip on hover */}
      {isHovered && (
        <motion.div
          className="tooltip -top-10 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
        >
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium">Spot {spot.spotNumber}</div>
            <div className="text-xs text-neutral-500">
              {spot.status === 'available' ? 'Available' : 'Occupied'}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ParkingSpot;
