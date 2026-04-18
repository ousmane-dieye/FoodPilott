import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'glass' | 'outline';
  hoverable?: boolean;
}

export const Card = ({ 
  className, 
  variant = 'default', 
  hoverable = false,
  children, 
  ...props 
}: CardProps) => {
  const variants = {
    default: "bg-surface shadow-soft border border-gray-200",
    glass: "glass",
    outline: "border-2 border-gray-200 bg-transparent shadow-none",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverable ? { y: -4, shadow: "var(--shadow-medium)" } : {}}
      className={cn(
        "rounded-2xl p-8 transition-all",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("mb-6", className)}>{children}</div>
);

export const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <h3 className={cn("text-2xl font-bold tracking-tight text-ink", className)}>{children}</h3>
);

export const CardDescription = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <p className={cn("text-base font-medium text-ink-secondary mt-2", className)}>{children}</p>
);
