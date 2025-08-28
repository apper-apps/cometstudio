import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = "" 
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={20} className="text-slate-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="pl-12 bg-slate-800/50 border-slate-600 focus:bg-slate-800"
      />
      {query && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setQuery("");
            if (onSearch) onSearch("");
          }}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
        >
          <ApperIcon name="X" size={16} />
        </motion.button>
      )}
    </motion.div>
  );
};

export default SearchBar;