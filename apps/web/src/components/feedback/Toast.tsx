import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn.js";
import { create } from "zustand";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export function toast(
  message: string,
  type: ToastType = "info",
  duration = 4000,
): void {
  useToastStore.getState().addToast({ message, type, duration });
}

toast.success = (msg: string) => toast(msg, "success");
toast.error = (msg: string) => toast(msg, "error");
toast.warning = (msg: string) => toast(msg, "warning");
toast.info = (msg: string) => toast(msg, "info");

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-status-success" />,
  error: <XCircle className="w-4 h-4 text-status-error" />,
  warning: <AlertCircle className="w-4 h-4 text-status-warning" />,
  info: <Info className="w-4 h-4 text-status-info" />,
};

const BG: Record<ToastType, string> = {
  success: "border-status-success/20",
  error: "border-status-error/20",
  warning: "border-status-warning/20",
  info: "border-status-info/20",
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }): JSX.Element {
  useEffect(() => {
    const timer = setTimeout(onRemove, toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-start gap-3 bg-bg-elevated border rounded-lg px-4 py-3 shadow-elevated",
        "min-w-[300px] max-w-sm",
        BG[toast.type],
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{ICONS[toast.type]}</div>
      <p className="flex-1 text-sm text-text-primary leading-snug">{toast.message}</p>
      <button
        onClick={onRemove}
        className="flex-shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export function ToastContainer(): JSX.Element {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onRemove={() => removeToast(t.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
