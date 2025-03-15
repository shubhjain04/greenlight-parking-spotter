import React, { useState, useRef, useEffect } from 'react';
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
