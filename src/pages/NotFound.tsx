
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-md w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-teal">404</span>
          </div>
          <h1 className="text-3xl font-display font-medium mb-4 text-neutral-800">Page not found</h1>
          <p className="text-neutral-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-teal hover:bg-teal-600 text-white"
          >
            <Home size={18} className="mr-2" />
            Return to home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
