import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  children,
  className = "",
  hover = true,
  clickable = false,
  ...props
}, ref) => {
  const baseStyles = "glass rounded-2xl border border-slate-700/50 transition-all duration-300";
  const hoverStyles = hover ? "glass-hover" : "";
  const clickableStyles = clickable ? "cursor-pointer" : "";

  const Component = clickable ? motion.div : "div";

  return (
    <Component
      ref={ref}
      className={cn(baseStyles, hoverStyles, clickableStyles, className)}
      whileHover={clickable ? { y: -4, scale: 1.01 } : {}}
      whileTap={clickable ? { scale: 0.99 } : {}}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

export default Card;