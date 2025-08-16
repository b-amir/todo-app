import React from "react";
import { useDialog } from "./context";

interface DialogCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DialogClose: React.FC<DialogCloseProps> = ({
  children,
  asChild = false,
}) => {
  const { close } = useDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<React.ComponentProps<"button">>,
      {
        onClick: (e: React.MouseEvent<Element>) => {
          e.stopPropagation();
          close();
          const originalOnClick = (
            children as React.ReactElement<React.ComponentProps<"button">>
          ).props.onClick;
          if (originalOnClick) {
            originalOnClick(e as React.MouseEvent<HTMLButtonElement>);
          }
        },
      }
    );
  }

  return (
    <button
      type="button"
      onClick={close}
      className="cursor-pointer"
      aria-label="Close dialog"
    >
      {children}
    </button>
  );
};
