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
        "opacity-80 hover:opacity-100 active:cursor-grabbing",
        "touch-none"
      )}
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        controls.start(e);
      }}
      onTouchStart={(e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";

        const touch = e.touches[0];
        if (touch) {
          const pointerEvent = new PointerEvent("pointerdown", {
            clientX: touch.clientX,
            clientY: touch.clientY,
            pointerId: touch.identifier,
            pointerType: "touch",
          });
          controls.start(pointerEvent);
        }
      }}
      onTouchMove={(e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onTouchEnd={(e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
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
