import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  className?: string;
  key?: string | number;
}

export const Badge = ({ children, variant = 'primary', className, ...props }: BadgeProps) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-gray-100 text-gray-600 border-gray-200",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    danger: "bg-red-50 text-red-600 border-red-100",
    outline: "bg-transparent text-gray-500 border-gray-200",
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider border",
        variants[variant],
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
};
