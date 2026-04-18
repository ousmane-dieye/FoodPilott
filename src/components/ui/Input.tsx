import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-sm font-bold text-ink-secondary uppercase tracking-wider ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-background border-2 border-gray-300 rounded-2xl py-4 px-4 text-base font-semibold transition-all placeholder:text-gray-400 outline-none",
              "focus:border-primary focus:bg-surface focus:shadow-soft focus:ring-4 focus:ring-primary/10",
              icon && "pl-12",
              error && "border-red-500 focus:border-red-500 bg-red-50/10",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm font-bold text-red-600 ml-1 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
