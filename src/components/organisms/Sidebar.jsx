import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { 
      path: "/", 
      label: "Data", 
      icon: "Database",
      description: "Upload and explore datasets"
    },
    { 
      path: "/model", 
      label: "Model", 
      icon: "Brain",
      description: "Configure ML algorithms"
    },
    { 
      path: "/training", 
      label: "Training", 
      icon: "Zap",
      description: "Train your models"
    },
    { 
      path: "/evaluation", 
      label: "Evaluation", 
      icon: "BarChart3",
      description: "Analyze model performance"
    },
    { 
      path: "/predictions", 
      label: "Predictions", 
      icon: "Target",
      description: "Make predictions"
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 glass border-r border-slate-700">
        <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <ApperIcon name="Brain" size={24} className="text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gradient">ML Studio</h1>
              <p className="text-xs text-slate-400">Machine Learning Platform</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-primary text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={20} 
                    className={cn(
                      "mr-3",
                      isActive ? "text-white" : "text-slate-400"
                    )} 
                  />
                  <div className="text-left">
                    <div>{item.label}</div>
                    <div className={cn(
                      "text-xs",
                      isActive ? "text-white/80" : "text-slate-500"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-80 glass border-r border-slate-700 lg:hidden"
          >
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
                {/* Logo */}
                <div className="flex items-center flex-shrink-0 px-6 mb-8">
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <ApperIcon name="Brain" size={24} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-gradient">ML Studio</h1>
                    <p className="text-xs text-slate-400">Machine Learning Platform</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-auto p-2 text-slate-400 hover:text-white"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.button
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        className={cn(
                          "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-gradient-primary text-white shadow-lg"
                            : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                        )}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ApperIcon 
                          name={item.icon} 
                          size={20} 
                          className={cn(
                            "mr-3",
                            isActive ? "text-white" : "text-slate-400"
                          )} 
                        />
                        <div className="text-left">
                          <div>{item.label}</div>
                          <div className={cn(
                            "text-xs",
                            isActive ? "text-white/80" : "text-slate-500"
                          )}>
                            {item.description}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;