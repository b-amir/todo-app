import React from "react";

import { cn } from "@/src/shared/utils/tailwindUtils";

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  className,
}) => <p className={cn("text-sm text-gray-600", className)}>{children}</p>;
