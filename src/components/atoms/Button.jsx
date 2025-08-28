import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({
  children,
  className = "",
  variant = "default",
  size = "md",
  disabled = false,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500",
    primary: "bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 text-white hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-gradient-accent hover:shadow-lg hover:shadow-secondary/25 text-white hover:scale-[1.02] active:scale-[0.98]",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-slate-300 hover:text-white hover:bg-slate-700/50",
    danger: "bg-gradient-to-r from-error to-red-600 hover:shadow-lg hover:shadow-error/25 text-white hover:scale-[1.02]"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm h-9",
    md: "px-6 py-3 text-sm h-11",
    lg: "px-8 py-4 text-base h-13"
  };

  const Component = motion.button;

  return (
    <Component
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { y: 0 }}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = "Button";

export default Button;