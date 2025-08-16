import React, { useState } from "react";
import { FiX as X } from "react-icons/fi";

import { cn } from "@/src/shared/utils/tailwindUtils";

import { useDialog } from "./context";

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
}) => {
  const { isOpen, close } = useDialog();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          close();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          close();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div
        className={cn(
          "fixed left-[50%] top-[50%] z-[9999] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border border-gray-200 bg-white p-6 shadow-lg",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={close}
          className="absolute right-4 top-4 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100 text-black"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
};
