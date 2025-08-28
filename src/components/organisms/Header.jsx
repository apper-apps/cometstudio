import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title = "ML Studio" }) => {
  return (
    <motion.header 
      className="glass border-b border-slate-700 px-6 py-4 lg:ml-72"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-3"
            onClick={onMenuClick}
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="text-sm text-slate-400">Build and train ML models visually</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" size={18} />
          </Button>
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="HelpCircle" size={18} />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;