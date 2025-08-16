import React from "react";
import { useDialog } from "./context";

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  children,
  asChild = false,
}) => {
  const { open } = useDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{
        onClick?: (e: React.MouseEvent) => void;
      }>,
      {
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          open();
          (
            children as React.ReactElement<{
              onClick?: (e: React.MouseEvent) => void;
            }>
          ).props.onClick?.(e);
        },
      }
    );
  }

  return (
    <div
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          open();
        }
      }}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
};
