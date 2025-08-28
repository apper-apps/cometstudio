import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = "up",
  format = "number"
}) => {
  const formatValue = (val) => {
    if (format === "percentage") {
      return `${(val * 100).toFixed(2)}%`;
    }
    if (format === "currency") {
      return `$${val.toLocaleString()}`;
    }
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-error";
    return "text-slate-400";
  };

  const getTrendIcon = () => {
    if (trend === "up") return "TrendingUp";
    if (trend === "down") return "TrendingDown";
    return "Minus";
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-1">
            {title}
          </p>
          <motion.p 
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={value}
          >
            {formatValue(value)}
          </motion.p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
              <ApperIcon name={getTrendIcon()} size={14} />
              <span>{Math.abs(change)}% from last time</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;