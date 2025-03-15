
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Bell, User, Compass } from 'lucide-react';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: MapPin, label: 'Map', path: '/' },
    { icon: Compass, label: 'Directions', path: '/directions' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto glassmorphic rounded-t-2xl shadow-lg">
        <nav className="flex justify-around items-center p-2 pt-3 pb-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <div className={`p-1.5 rounded-full ${isActive(item.path) ? 'bg-teal/10' : ''}`}>
                <item.icon
                  size={20}
                  className={`transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-teal'
                      : 'text-neutral-500'
                  }`}
                />
              </div>
              <span className={`text-xs mt-1 font-medium ${
                isActive(item.path) ? 'text-teal' : 'text-neutral-500'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
