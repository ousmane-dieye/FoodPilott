import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-primary text-white shadow-soft hover:bg-primary-dark hover:shadow-medium",
      secondary:
        "bg-surface text-ink border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-soft",
      outline:
        "border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-soft",
      ghost:
        "text-ink-secondary hover:bg-gray-100 hover:text-ink ring-1 ring-transparent hover:ring-gray-200",
      danger:
        "bg-red-500 text-white hover:bg-red-600 shadow-soft hover:shadow-medium",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-xl",
      md: "px-6 py-3 text-base rounded-2xl",
      lg: "px-8 py-4 text-lg rounded-3xl",
      icon: "p-3 rounded-2xl",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        ) : null}
        <span className={cn(isLoading && "opacity-0")}>{children}</span>
      </motion.button>
    );
  },
);
