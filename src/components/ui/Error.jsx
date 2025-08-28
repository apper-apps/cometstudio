import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center mb-6"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, -5, 5, 0] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <ApperIcon name="AlertTriangle" size={40} className="text-error" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-slate-400 mb-6 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;