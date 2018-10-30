import { useCallback, useState, useEffect } from "react";
import useGlobalKeyboardShortcut from "../../hooks/useGlobalKeyboardShortcut";
import { getCanvasCoordinatesForEvent } from "../../graph/canvasUtil";

export default ref => {
  const [selectionRectangle, setSelectionRectangle] = useState(null);
  const needsSelectionListeners = selectionRectangle != null;

  const startSelectionRectangle = useCallback(
    e => {
      const canvasCoords = getCanvasCoordinatesForEvent(e);
      if (canvasCoords != null) {
        const { x, y } = canvasCoords;
        setSelectionRectangle({ x0: x, y0: y, x1: x, y1: y });
      }
    },
    [setSelectionRectangle]
  );

  const cancelSelectionRectangle = useCallback(
    () => setSelectionRectangle(null),
    [setSelectionRectangle]
  );

  const updateSelectionRectangle = useCallback(
    e => {
      const canvasCoords = getCanvasCoordinatesForEvent(e);
      if (canvasCoords != null) {
        const { x: x1, y: y1 } = canvasCoords;
        setSelectionRectangle(
          s => (s != null ? { x0: s.x0, y0: s.y0, x1, y1 } : null)
        );
      }
    },
    [setSelectionRectangle]
  );

  useEffect(
    () => {
      if (needsSelectionListeners) {
        ref.current.addEventListener("mousemove", updateSelectionRectangle);
        ref.current.addEventListener("mouseup", cancelSelectionRectangle);
      }

      return () => {
        ref.current.removeEventListener("mousemove", updateSelectionRectangle);
        ref.current.removeEventListener("mouseup", cancelSelectionRectangle);
      };
    },
    [
      ref,
      needsSelectionListeners,
      updateSelectionRectangle,
      cancelSelectionRectangle
    ]
  );

  useGlobalKeyboardShortcut("Escape", cancelSelectionRectangle);

  return {
    selectionRectangle,
    startSelectionRectangle,
    cancelSelectionRectangle
  };
};
