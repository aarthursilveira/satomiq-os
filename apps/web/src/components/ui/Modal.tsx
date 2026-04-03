import { useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn.js";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
}: ModalProps): JSX.Element {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent): void {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative w-full z-10 bg-bg-elevated border border-border-default rounded-xl shadow-modal",
              sizeClasses[size],
              className,
            )}
          >
            {(title || description) && (
              <div className="flex items-start justify-between p-5 pb-0">
                <div>
                  {title && (
                    <h2 className="text-base font-semibold text-text-primary">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-text-secondary mt-0.5">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
