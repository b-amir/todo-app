import { useCallback } from "react";
import { useDragControls, useMotionValue, useTransform } from "framer-motion";

export function useTodoDrag() {
  const controls = useDragControls();
  const dragProgress = useMotionValue(0);

  const scale = useTransform(dragProgress, [0, 1], [1, 1.02]);
  const zIndex = useTransform(dragProgress, [0, 1], [1, 50]);

  const handleDragStart = useCallback(() => {
    dragProgress.set(1);
  }, [dragProgress]);

  const handleDragEnd = useCallback(() => {
    dragProgress.set(0);
  }, [dragProgress]);

  return {
    controls,
    scale,
    zIndex,
    handleDragStart,
    handleDragEnd,
  };
}
