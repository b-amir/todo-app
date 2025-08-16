import React, { useState, useCallback } from "react";
import { DialogContext } from "./context";

interface DialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DialogContext.Provider value={{ isOpen, open, close }}>
      {children}
    </DialogContext.Provider>
  );
};
