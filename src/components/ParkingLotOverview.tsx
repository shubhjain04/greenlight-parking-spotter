
import React from 'react';
import { motion } from 'framer-motion';
import { useParkingContext, ParkingLot } from '@/contexts/ParkingContext';
import StatusBadge from './StatusBadge';

interface ParkingLotOverviewProps {
  lot: ParkingLot;
  onClick?: () => void;
  isSelected?: boolean;
}

const ParkingLotOverview: React.FC<ParkingLotOverviewProps> = ({
  lot,
  onClick,
  isSelected = false,
}) => {
  const { spots } = useParkingContext();
  
  const availabilityPercentage = (lot.availableSpots / lot.totalSpots) * 100;
  const availabilityStatus = 
    availabilityPercentage > 30 ? 'available' : 
    availabilityPercentage > 10 ? 'almost-full' : 'occupied';
  
  return (
    <motion.div
      className={`glassmorphic rounded-lg p-3 cursor-pointer ${
        isSelected ? 'ring-2 ring-teal shadow-lg' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm">{lot.name}</h3>
        <StatusBadge
          type={availabilityStatus}
          text={
            availabilityStatus === 'available' ? 'Available' : 
            availabilityStatus === 'almost-full' ? 'Almost Full' : 'Full'
          }
          count={lot.availableSpots}
          icon={false}
        />
      </div>
      
      <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${availabilityPercentage}%`,
            backgroundColor: 
              availabilityStatus === 'available' ? '#12b76a' : 
              availabilityStatus === 'almost-full' ? '#f59e0b' : '#ea384c'
          }}
        />
      </div>
      
      <div className="mt-2 text-xs text-neutral-500">
        {lot.availableSpots} of {lot.totalSpots} spots available
      </div>
    </motion.div>
  );
};

export default ParkingLotOverview;
