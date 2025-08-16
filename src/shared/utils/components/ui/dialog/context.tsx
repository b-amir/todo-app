import { createContext, useContext } from "react";

interface DialogContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
