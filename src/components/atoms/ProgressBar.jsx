import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  className = "",
  size = "md",
  animated = true,
  showValue = false 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  return (
    <div className={cn("w-full", className)}>
      {showValue && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-300">Progress</span>
          <span className="text-sm font-medium text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={cn("bg-slate-700 rounded-full overflow-hidden", sizes[size])}>
        <motion.div
          className="h-full bg-gradient-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 0.5 : 0,
            ease: "easeOut" 
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;