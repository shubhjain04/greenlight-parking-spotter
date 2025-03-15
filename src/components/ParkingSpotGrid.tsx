import React from 'react';

interface ParkingSpotGridProps {
  spots: { id: string; status: 'available' | 'occupied'; type?: 'handicapped' | 'electric' }[];
}

const ParkingSpotGrid: React.FC<ParkingSpotGridProps> = ({ spots }) => {
  return (
    <div className="grid grid-cols-5 gap-2 p-4">
      {spots.map((spot) => (
        <div
          key={spot.id}
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${
            spot.status === 'available' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {spot.type === 'handicapped' ? '♿' : spot.type === 'electric' ? '⚡' : ''}
        </div>
      ))}
    </div>
  );
};

export default ParkingSpotGrid;
