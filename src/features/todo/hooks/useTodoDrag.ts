import { useCallback, useEffect } from "react";
import { useDragControls, useMotionValue, useTransform } from "framer-motion";

export function useTodoDrag() {
  const controls = useDragControls();
  const dragProgress = useMotionValue(0);

  const scale = useTransform(dragProgress, [0, 1], [1, 1.02]);
  const zIndex = useTransform(dragProgress, [0, 1], [1, 50]);

  const handleDragStart = useCallback(() => {
    dragProgress.set(1);
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }, [dragProgress]);

  const handleDragEnd = useCallback(() => {
    dragProgress.set(0);
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }, [dragProgress]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, []);

  return {
    controls,
    scale,
    zIndex,
    handleDragStart,
    handleDragEnd,
  };
}
