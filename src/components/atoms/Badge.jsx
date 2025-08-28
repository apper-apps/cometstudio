import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({
  children,
  className = "",
  variant = "default",
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
  
  const variants = {
    default: "bg-slate-700 text-slate-200",
    primary: "bg-primary/20 text-primary border border-primary/30",
    secondary: "bg-secondary/20 text-secondary border border-secondary/30",
    success: "bg-success/20 text-success border border-success/30",
    warning: "bg-warning/20 text-warning border border-warning/30",
    error: "bg-error/20 text-error border border-error/30",
    info: "bg-info/20 text-info border border-info/30"
  };

  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;