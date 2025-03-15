
import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Settings, Car, History, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Navigation from '@/components/Navigation';
import { toast } from 'sonner';

const Profile = () => {
  const handleLogout = () => {
    toast.info("Logout functionality would be implemented here");
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-teal text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <User size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-medium">User Profile</h1>
            <p className="text-teal-100">user@example.com</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Settings section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm mb-6"
        >
          <div className="p-4 border-b">
            <h2 className="font-medium flex items-center">
              <Settings size={16} className="mr-2" />
              Settings
            </h2>
          </div>
          
          <div className="p-4 flex flex-col space-y-4">
            {/* Notification settings */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Push Notifications</h3>
                <p className="text-xs text-neutral-500">
                  Receive alerts for spot availability
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            {/* Location settings */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Location Services</h3>
                <p className="text-xs text-neutral-500">
                  Use your location to find nearby spots
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            {/* Dark mode */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Dark Mode</h3>
                <p className="text-xs text-neutral-500">
                  Use dark theme for the app
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </motion.div>
        
        {/* Vehicle information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm mb-6"
        >
          <div className="p-4 border-b">
            <h2 className="font-medium flex items-center">
              <Car size={16} className="mr-2" />
              Vehicle Information
            </h2>
          </div>
          
          <div className="p-4">
            <div className="mb-3">
              <h3 className="text-xs text-neutral-500">License Plate</h3>
              <p>ABC-1234</p>
            </div>
            <div>
              <h3 className="text-xs text-neutral-500">Vehicle Type</h3>
              <p>Sedan</p>
            </div>
          </div>
        </motion.div>
        
        {/* Parking History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm mb-6"
        >
          <div className="p-4 border-b">
            <h2 className="font-medium flex items-center">
              <History size={16} className="mr-2" />
              Recent Parking
            </h2>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Lot A - MacKinnon Hall</h3>
                  <p className="text-xs text-neutral-500">Yesterday, 2:30 PM</p>
                </div>
                <span className="text-xs bg-teal-50 text-teal px-2 py-1 rounded">
                  2h 15m
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Lot B - Campus Road</h3>
                  <p className="text-xs text-neutral-500">Mar 12, 9:45 AM</p>
                </div>
                <span className="text-xs bg-teal-50 text-teal px-2 py-1 rounded">
                  1h 30m
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Logout button */}
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-500 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
      
      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Profile;
