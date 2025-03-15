
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 300,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };
  
  const getArrowStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-white dark:border-t-neutral-800 border-l-transparent border-r-transparent border-b-transparent';
      case 'bottom':
        return 'top-[-6px] left-1/2 -translate-x-1/2 border-b-white dark:border-b-neutral-800 border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'right-[-6px] top-1/2 -translate-y-1/2 border-l-white dark:border-l-neutral-800 border-t-transparent border-b-transparent border-r-transparent';
      case 'right':
        return 'left-[-6px] top-1/2 -translate-y-1/2 border-r-white dark:border-r-neutral-800 border-t-transparent border-b-transparent border-l-transparent';
      default:
        return 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-white dark:border-t-neutral-800 border-l-transparent border-r-transparent border-b-transparent';
    }
  };
  
  // Delay showing/hiding the tooltip
  useEffect(() => {
    if (isHovered) {
      timerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setIsVisible(false);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isHovered, delay]);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 w-max max-w-xs ${getPositionStyles()} ${className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="glassmorphic px-3 py-2 rounded-md text-sm text-neutral-800 dark:text-white">
              {content}
            </div>
            <div 
              className={`absolute w-0 h-0 border-4 ${getArrowStyles()}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
