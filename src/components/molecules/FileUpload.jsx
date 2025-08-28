import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FileUpload = ({ 
  onFileSelect, 
  accept = ".csv", 
  maxSize = 10 * 1024 * 1024, // 10MB
  className = "" 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileSelection(files);
  };

  const handleFileSelection = (files) => {
    setError("");
    
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Please select a CSV file");
      return;
    }
    
    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }
    
    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <motion.div
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
          isDragging 
            ? "border-primary bg-primary/10" 
            : "border-slate-600 hover:border-primary/50 hover:bg-slate-800/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <AnimatePresence mode="wait">
          {isDragging ? (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <ApperIcon name="Download" size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Drop your file here</h3>
                <p className="text-slate-400">Release to upload your CSV dataset</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center">
                <ApperIcon name="Upload" size={32} className="text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Upload your dataset</h3>
                <p className="text-slate-400">Drag and drop a CSV file, or click to browse</p>
                <p className="text-sm text-slate-500 mt-2">Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB</p>
              </div>
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-error text-sm bg-error/10 border border-error/20 rounded-lg p-3"
        >
          <ApperIcon name="AlertCircle" size={16} />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;