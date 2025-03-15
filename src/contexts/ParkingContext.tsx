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
};

export const ParkingProvider: React.FC = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <ParkingContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </ParkingContext.Provider>
  );
};
