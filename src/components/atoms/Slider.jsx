import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Slider = forwardRef(({
  className = "",
  label,
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  ...props
}, ref) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(parseFloat(e.target.value));
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-slate-300">
            {label}
          </label>
          <span className="text-sm font-medium text-primary">
            {value}
          </span>
        </div>
      )}
      <div className="relative">
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={cn(
            "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider",
            className
          )}
          style={{
            background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`
          }}
          {...props}
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366F1, #8B5CF6);
            cursor: pointer;
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
            transition: all 0.2s;
          }
          
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366F1, #8B5CF6);
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
});

Slider.displayName = "Slider";

export default Slider;