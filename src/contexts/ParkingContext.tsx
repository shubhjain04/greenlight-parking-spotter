import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

export type ParkingSpot = {
  id: string;
  lot: string;
  spotNumber: string;
  status: 'available' | 'occupied';
  coordinates: [number, number];
  lastUpdated: Date;
  timeLimit?: number; // in minutes
  distance?: number; // in meters from user
  type?: 'regular' | 'handicap' | 'electric' | 'compact';
};

export type ParkingLot = {
  id: string;
  name: string;
  totalSpots: number;
  availableSpots: number;
  coordinates: [number, number];
  polygon?: Array<[number, number]>; // Polygon coordinates for the lot area
  lastUpdated: Date;
};

type ParkingContextType = {
  spots: ParkingSpot[];
  lots: ParkingLot[];
  selectedSpot: ParkingSpot | null;
  selectedLot: ParkingLot | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  setSelectedSpot: (spot: ParkingSpot | null) => void;
  setSelectedLot: (lot: ParkingLot | null) => void;
  setSearchQuery: (query: string) => void;
  refreshData: () => Promise<void>;
  reportIncorrectData: (spotId: string, actualStatus: 'available' | 'occupied') => Promise<void>;
  subscribeToSpot: (spotId: string) => Promise<void>;
  unsubscribeFromSpot: (spotId: string) => Promise<void>;
  subscribedSpots: string[];
};

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

// Mock data for demonstration
const mockParkingSpots: ParkingSpot[] = Array.from({ length: 80 }, (_, i) => ({
  id: `spot-${i + 1}`,
  lot: i < 40 ? "Lot A" : "Lot B",
  spotNumber: `${i + 1}`,
  status: Math.random() > 0.6 ? 'available' : 'occupied',
  coordinates: [
    -83.606705 + (Math.random() - 0.5) * 0.01,
    41.658693 + (Math.random() - 0.5) * 0.01
  ],
  lastUpdated: new Date(),
  timeLimit: Math.random() > 0.5 ? 120 : 60,
  distance: Math.floor(Math.random() * 500),
  type: i % 10 === 0 ? 'handicap' : i % 15 === 0 ? 'electric' : 'regular'
}));

const mockParkingLots: ParkingLot[] = [
  {
    id: "lot-a",
    name: "Lot A - MacKinnon Hall",
    totalSpots: 40,
    availableSpots: mockParkingSpots.filter(s => s.lot === "Lot A" && s.status === 'available').length,
    coordinates: [-83.606705, 41.658693],
    polygon: [
      [-83.607, 41.659],
      [-83.606, 41.659],
      [-83.606, 41.658],
      [-83.607, 41.658],
    ],
    lastUpdated: new Date()
  },
  {
    id: "lot-b",
    name: "Lot B - Campus Road",
    totalSpots: 40,
    availableSpots: mockParkingSpots.filter(s => s.lot === "Lot B" && s.status === 'available').length,
    coordinates: [-83.607705, 41.659693],
    polygon: [
      [-83.608, 41.660],
      [-83.607, 41.660],
      [-83.607, 41.659],
      [-83.608, 41.659],
    ],
    lastUpdated: new Date()
  }
];

export const ParkingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [spots, setSpots] = useState<ParkingSpot[]>(mockParkingSpots);
  const [lots, setLots] = useState<ParkingLot[]>(mockParkingLots);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [subscribedSpots, setSubscribedSpots] = useState<string[]>([]);

  // Simulate data refresh
  const refreshData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update some random spots to simulate real-time changes
      const updatedSpots = spots.map(spot => ({
        ...spot,
        status: Math.random() > 0.7 ? (spot.status === 'available' ? 'occupied' : 'available') : spot.status,
        lastUpdated: new Date()
      }));
      
      // Update lots with new available spot counts
      const updatedLots = lots.map(lot => ({
        ...lot,
        availableSpots: updatedSpots.filter(s => s.lot === lot.name && s.status === 'available').length,
        lastUpdated: new Date()
      }));
      
      setSpots(updatedSpots);
      setLots(updatedLots);
      setLastUpdated(new Date());
      
      toast.success("Parking data refreshed", {
        description: `Last updated: ${new Date().toLocaleTimeString()}`,
      });
    } catch (err) {
      setError('Failed to refresh parking data');
      console.error('Error refreshing data:', err);
      
      toast.error("Failed to refresh data", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Report incorrect spot data
  const reportIncorrectData = async (spotId: string, actualStatus: 'available' | 'occupied'): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the spot in our state
      const updatedSpots = spots.map(spot => 
        spot.id === spotId ? { ...spot, status: actualStatus, lastUpdated: new Date() } : spot
      );
      
      setSpots(updatedSpots);
      
      toast.success("Thank you for your report", {
        description: "The spot status has been updated",
      });
    } catch (err) {
      setError('Failed to report incorrect data');
      console.error('Error reporting data:', err);
      
      toast.error("Failed to submit report", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to spot availability notifications
  const subscribeToSpot = async (spotId: string): Promise<void> => {
    if (subscribedSpots.includes(spotId)) {
      toast.info("Already subscribed", {
        description: "You will be notified when this spot becomes available",
      });
      return;
    }
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSubscribedSpots(prev => [...prev, spotId]);
      
      toast.success("Subscription added", {
        description: "You will be notified when this spot becomes available",
      });
    } catch (err) {
      setError('Failed to subscribe to spot');
      console.error('Error subscribing:', err);
      
      toast.error("Failed to subscribe", {
        description: "Please try again later",
      });
    }
  };

  // Unsubscribe from spot availability notifications
  const unsubscribeFromSpot = async (spotId: string): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSubscribedSpots(prev => prev.filter(id => id !== spotId));
      
      toast.success("Subscription removed", {
        description: "You will no longer receive notifications for this spot",
      });
    } catch (err) {
      setError('Failed to unsubscribe from spot');
      console.error('Error unsubscribing:', err);
      
      toast.error("Failed to unsubscribe", {
        description: "Please try again later",
      });
    }
  };

  // Simulate initial loading
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Data is already set in state initialization
        setLastUpdated(new Date());
      } catch (err) {
        setError('Failed to load parking data');
        console.error('Error loading data:', err);
        
        toast.error("Failed to load data", {
          description: "Please try again later",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
    
    // Set up periodic refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const value = {
    spots,
    lots,
    selectedSpot,
    selectedLot,
    searchQuery,
    isLoading,
    error,
    lastUpdated,
    setSelectedSpot,
    setSelectedLot,
    setSearchQuery,
    refreshData,
    reportIncorrectData,
    subscribeToSpot,
    unsubscribeFromSpot,
    subscribedSpots
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
};

export const useParkingContext = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParkingContext must be used within a ParkingProvider');
  }
  return context;
};
