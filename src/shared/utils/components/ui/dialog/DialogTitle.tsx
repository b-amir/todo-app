import React from "react";

import { cn } from "@/src/shared/utils/tailwindUtils";

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className,
}) => (
  <h2
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-black mb-6",
      className
    )}
  >
    {children}
  </h2>
);
