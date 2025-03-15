
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

type BadgeType = 
  | 'available'
  | 'occupied'
  | 'almost-full'
  | 'notification'
  | 'warning'
  | 'info'
  | 'success';

interface StatusBadgeProps {
  type: BadgeType;
  text: string;
  count?: number;
  icon?: boolean;
  animate?: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  type, 
  text, 
  count,
  icon = true,
  animate = false,
  className = "",
}) => {
  const getIcon = () => {
    switch (type) {
      case 'available':
      case 'almost-full':
      case 'occupied':
        return <Clock size={14} />;
      case 'notification':
      case 'info':
        return <MapPin size={14} />;
      case 'warning':
        return <AlertTriangle size={14} />;
      case 'success':
        return <CheckCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };
  
  const getColorClass = () => {
    switch (type) {
      case 'available':
        return 'bg-available text-available-foreground';
      case 'occupied':
        return 'bg-occupied text-occupied-foreground';
      case 'almost-full':
        return 'bg-amber-500 text-white';
      case 'notification':
        return 'bg-blue-500 text-white';
      case 'warning':
        return 'bg-amber-500 text-white';
      case 'info':
        return 'bg-teal text-white';
      case 'success':
        return 'bg-green-500 text-white';
      default:
        return 'bg-neutral-300 text-neutral-800';
    }
  };
  
  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getColorClass()} ${className}`}
      initial={animate ? { opacity: 0, scale: 0.9 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {icon && getIcon()}
      <span>{text}</span>
      {count !== undefined && (
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[10px]">
          {count}
        </span>
      )}
    </motion.div>
  );
};

export default StatusBadge;
