import React from "react";
import { FiX as X } from "react-icons/fi";

import { cn } from "@/src/shared/utils/tailwindUtils";

import { Button } from "@/src/shared/components/ui/button";

interface DeleteTodoButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export const DeleteTodoButton: React.FC<DeleteTodoButtonProps> = ({
  onClick,
}) => (
  <Button
    size="sm"
    variant="ghost"
    onClick={onClick}
    className={cn(
      "h-8 w-8 p-0 text-red-600 opacity-80 transition-all duration-150 ease-out hover:text-red-700 hover:opacity-100",
      "hover:scale-110 active:scale-95"
    )}
    data-clickable="false"
  >
    <X className="h-4 w-4" />
  </Button>
);
