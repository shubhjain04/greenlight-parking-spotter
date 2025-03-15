import React, { createContext, useState, useContext } from 'react';

interface ParkingContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const useParkingContext = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParkingContext must be used within a ParkingProvider');
  }
  return context;
};import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { useParkingContext } from '@/contexts/ParkingContext';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search for locations...", 
  className = "" 
}) => {
  const { setSearchQuery, searchQuery } = useParkingContext();
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local value when search query changes
  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localValue); // Set the search query in context
  };

  const handleClear = () => {
    setLocalValue('');
    setSearchQuery(''); // Clear search query in context
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      <form
        onSubmit={handleSubmit}
        className={`flex items-center glassmorphic rounded-full px-4 py-3 transition-all duration-300 ${
          isFocused ? 'ring-2 ring-teal-300 shadow-lg' : 'shadow-subtle'
        }`}
      >
        <MapPin size={18} className="text-teal flex-shrink-0" />
        
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent border-none outline-none px-3 text-neutral-800 dark:text-white placeholder-neutral-500"
        />
        
        {localValue ? (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 p-1 rounded-full text-neutral-500 hover:text-neutral-700 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            type="submit"
            className="flex-shrink-0 p-1 rounded-full text-neutral-500 hover:text-neutral-700 dark:hover:text-white transition-colors"
          >
            <Search size={18} />
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;

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

// Real parking data
const parkingLots: ParkingLot[] = [
  {
    id: "lot-campus",
    name: "Campus Main Parking",
    totalSpots: 120,
    availableSpots: 45,
    coordinates: [-83.606705, 41.658693],
    lastUpdated: new Date()
  },
  {
    id: "lot-library",
    name: "Library Parking",
    totalSpots: 80,
    availableSpots: 12,
    coordinates: [-83.607705, 41.659693],
    lastUpdated: new Date()
  },
  {
    id: "lot-student-center",
    name: "Student Center",
    totalSpots: 150,
    availableSpots: 67,
    coordinates: [-83.604705, 41.657693],
    lastUpdated: new Date()
  }
];

// Create matching spots for the real parking lots
const parkingSpots: ParkingSpot[] = [];

// Generate spots for each lot
parkingLots.forEach(lot => {
  const spotCount = lot.totalSpots;
  const availableCount = lot.availableSpots;
  
  // Create spots for each lot
  for (let i = 0; i < spotCount; i++) {
    // Determine if this spot should be available (distribute available spots)
    const status = i < availableCount ? 'available' : 'occupied';
    
    // Determine spot type (make some special spots)
    let type: 'regular' | 'handicap' | 'electric' | 'compact' = 'regular';
    if (i % 10 === 0) type = 'handicap';
    else if (i % 15 === 0) type = 'electric';
    else if (i % 20 === 0) type = 'compact';
    
    parkingSpots.push({
      id: `${lot.id}-spot-${i + 1}`,
      lot: lot.name,
      spotNumber: `${i + 1}`,
      status,
      coordinates: [
        lot.coordinates[0] + (Math.random() - 0.5) * 0.002,
        lot.coordinates[1] + (Math.random() - 0.5) * 0.002
      ],
      lastUpdated: new Date(),
      timeLimit: Math.random() > 0.5 ? 120 : 60,
      distance: Math.floor(Math.random() * 500),
      type
    });
  }
});

export const ParkingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [spots, setSpots] = useState<ParkingSpot[]>(parkingSpots);
  const [lots, setLots] = useState<ParkingLot[]>(parkingLots);
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
      const updatedLots = lots.map(lot => {
        const availableCount = updatedSpots.filter(s => s.lot === lot.name && s.status === 'available').length;
        return {
          ...lot,
          availableSpots: availableCount,
          lastUpdated: new Date()
        };
      });
      
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


export const ParkingProvider: React.FC = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <ParkingContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </ParkingContext.Provider>
  );
};
