import { VscGripper as GripVertical } from "react-icons/vsc";
import { cn } from "@/src/shared/utils/tailwindUtils";
import { DragControls } from "framer-motion";

interface TodoItemDragHandleProps {
  controls: DragControls;
}

export function TodoItemDragHandle({ controls }: TodoItemDragHandleProps) {
  return (
    <button
      className={cn(
        "cursor-grab hover:cursor-grabbing p-1.5 rounded-md transition-all duration-150 ease-out flex-shrink-0",
        "opacity-80 hover:opacity-100 active:cursor-grabbing"
      )}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        controls.start(e);
      }}
      onClick={(e) => e.stopPropagation()}
      aria-label="Drag to reorder"
      data-clickable="false"
    >
      <GripVertical
        className={cn(
          "h-4 w-4 text-ink-600 transition-colors duration-150",
          "hover:text-ink-800"
        )}
      />
    </button>
  );
}
