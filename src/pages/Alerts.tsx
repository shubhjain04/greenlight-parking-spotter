
import React from 'react';
import { motion } from 'framer-motion';
import { useParkingContext } from '@/contexts/ParkingContext';
import { Bell, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { toast } from 'sonner';

const Alerts = () => {
  const { spots, subscribedSpots, subscribeToSpot, unsubscribeFromSpot } = useParkingContext();
  
  const handleSubscribe = (spotId: string) => {
    subscribeToSpot(spotId);
  };
  
  const handleUnsubscribe = (spotId: string) => {
    unsubscribeFromSpot(spotId);
  };
  
  const handleClearAll = () => {
    subscribedSpots.forEach(spotId => {
      unsubscribeFromSpot(spotId);
    });
    toast.success("All alerts cleared");
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="glassmorphic sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-medium">Parking Alerts</h1>
            <Bell size={24} className="text-teal" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Active alerts section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Active Alerts</h2>
            {subscribedSpots.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearAll}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
          
          {subscribedSpots.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-4 text-center"
            >
              <p className="text-neutral-500">No active alerts</p>
              <p className="text-xs text-neutral-400 mt-1">
                Subscribe to spots to receive availability alerts
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {subscribedSpots.map(spotId => {
                const spot = spots.find(s => s.id === spotId);
                return (
                  <motion.div
                    key={spotId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <AlertTriangle size={14} className="text-amber-500 mr-2" />
                          <h3 className="font-medium">
                            {spot?.lot} - Spot {spot?.spotNumber}
                          </h3>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          Alert when spot becomes {spot?.status === 'available' ? 'occupied' : 'available'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUnsubscribe(spotId)}
                        className="h-8 w-8 rounded-full"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Suggested spots section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Suggested Spots</h2>
          <div className="space-y-3">
            {spots
              .filter(spot => !subscribedSpots.includes(spot.id))
              .filter(spot => spot.status === 'occupied')
              .slice(0, 5)
              .map(spot => (
                <motion.div
                  key={spot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        {spot.lot} - Spot {spot.spotNumber}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        Currently {spot.status}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSubscribe(spot.id)}
                      className="text-xs"
                    >
                      <Bell size={12} className="mr-1" />
                      Alert Me
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Alerts;
