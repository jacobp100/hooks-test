import { useMemo, useCallback, useState, useEffect } from "react";
import useGlobalKeyboardShortcut from "../../hooks/useGlobalKeyboardShortcut";
import {
  canvasCoordsToGraphCoords,
  getGraphCoordinatesForEvent
} from "../../graph/canvasUtil";

const coordsToSelection = coords =>
  coords != null
    ? {
        x: Math.min(coords.x0, coords.x1),
        y: Math.min(coords.y0, coords.y1),
        width: Math.abs(coords.x0 - coords.x1),
        height: Math.abs(coords.y0 - coords.y1)
      }
    : null;

export default (ref, canvasOrigin) => {
  const [rectangleCoords, setRectangleCoords] = useState(null);
  const needsSelectionListeners = rectangleCoords != null;

  const startSelectionRectangle = useCallback(
    e => {
      const graphCoords = getGraphCoordinatesForEvent(canvasOrigin, e);
      if (graphCoords != null) {
        const { x, y } = graphCoords;
        setRectangleCoords({ x0: x, y0: y, x1: x, y1: y });
      }
    },
    [setRectangleCoords]
  );

  const cancelSelectionRectangle = useCallback(() => setRectangleCoords(null), [
    setRectangleCoords
  ]);

  const updateSelectionRectangle = useCallback(
    e => {
      const origin = ref.current.getBoundingClientRect();
      const canvasCoords = { x: e.pageX - origin.x, y: e.pageY - origin.y };
      const { x: x1, y: y1 } = canvasCoordsToGraphCoords(
        canvasOrigin.get(),
        canvasCoords
      );
      setRectangleCoords(
        s => (s != null ? { x0: s.x0, y0: s.y0, x1, y1 } : null)
      );
    },
    [setRectangleCoords]
  );

  useEffect(
    () => {
      if (needsSelectionListeners) {
        document.addEventListener("mousemove", updateSelectionRectangle);
        document.addEventListener("mouseup", cancelSelectionRectangle);
      }

      return () => {
        document.removeEventListener("mousemove", updateSelectionRectangle);
        document.removeEventListener("mouseup", cancelSelectionRectangle);
      };
    },
    [
      needsSelectionListeners,
      updateSelectionRectangle,
      cancelSelectionRectangle
    ]
  );

  useGlobalKeyboardShortcut("Escape", cancelSelectionRectangle);

  const selectionRectangle = useMemo(() => coordsToSelection(rectangleCoords), [
    rectangleCoords
  ]);

  return {
    selectionRectangle,
    startSelectionRectangle,
    cancelSelectionRectangle
  };
};
