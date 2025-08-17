import React, { useState, useEffect, useRef } from "react";
import { FiX as X } from "react-icons/fi";

import { cn } from "@/src/shared/utils/tailwindUtils";

import { useDialog } from "./context";
import { Portal } from "./Portal";

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
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "unset";
      };
    }
    return undefined;
  }, [isOpen]);

  if (!mounted || !isOpen) {
    return null;
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[99998] bg-black/80 backdrop-blur-sm"
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
          ref={dialogRef}
          className={cn(
            "fixed left-[50%] top-[50%] z-[99999] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border border-gray-200 bg-white p-6 shadow-lg",
            "isolate",
            className
          )}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
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
    </Portal>
  );
};
