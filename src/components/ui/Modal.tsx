import React from "react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  width = 'md' 
}: ModalProps) => {
  const widths = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "relative w-full bg-surface rounded-[32px] shadow-large overflow-hidden",
              widths[width]
            )}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  {title && <h2 className="text-2xl font-black tracking-tighter text-ink">{title}</h2>}
                  {description && <p className="text-sm font-medium text-gray-400 mt-1">{description}</p>}
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-background text-gray-400 hover:text-ink transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="custom-scrollbar max-h-[70vh] overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
