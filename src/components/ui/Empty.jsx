import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data available",
  description = "Get started by adding your first item",
  icon = "Database",
  action,
  actionLabel = "Get Started"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full flex items-center justify-center mb-6"
        animate={{ 
          y: [0, -10, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <ApperIcon name={icon} size={48} className="text-primary" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-slate-400 mb-8 max-w-md text-lg">
        {description}
      </p>
      
      {action && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={action}
            variant="primary"
            size="lg"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={20} />
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;