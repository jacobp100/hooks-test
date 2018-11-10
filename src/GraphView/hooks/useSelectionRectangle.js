import { useMemo, useCallback, useState, useEffect } from "react";
import useGlobalKeyboardShortcut from "../../hooks/useGlobalKeyboardShortcut";
import {
  canvasCoordsToGraphCoords,
  getGraphCoordinatesForEvent
} from "../../graph/canvasUtil";

const createSelectionRectangle = (additive, start, end) =>
  start != null && end != null
    ? {
        additive,
        x0: Math.min(start.x, end.x),
        y0: Math.min(start.y, end.y),
        x1: Math.max(start.x, end.x),
        y1: Math.max(start.y, end.y)
      }
    : null;

export default (ref, camera, { onRectangleSelected } = {}) => {
  const [rectStart, setRectStart] = useState(null);
  const [rectEnd, setRectEnd] = useState(null);
  const [additive, setAdditive] = useState(false);
  const selectionRectangle = useMemo(
    () => createSelectionRectangle(additive, rectStart, rectEnd),
    [additive, rectStart, rectEnd]
  );

  const startSelectionRectangle = useCallback(
    e => {
      const graphCoords = getGraphCoordinatesForEvent(camera, e);
      if (graphCoords != null) {
        setRectStart(graphCoords);
        setRectEnd(graphCoords);
        setAdditive(e.shiftKey);
      }
    },
    [setRectStart, setAdditive]
  );

  const updateSelectionRectangle = useCallback(
    e => {
      const origin = ref.current.getBoundingClientRect();
      const canvasCoords = { x: e.pageX - origin.x, y: e.pageY - origin.y };
      const graphCoords = canvasCoordsToGraphCoords(camera.get(), canvasCoords);
      setRectEnd(graphCoords);
    },
    [setRectEnd]
  );

  const cancelSelectionRectangle = useCallback(
    () => {
      setRectStart(null);
      setRectEnd(null);
      setAdditive(false);
    },
    [setRectEnd]
  );

  const finalizeSelectionRectangle = useCallback(
    () => {
      if (selectionRectangle != null && onRectangleSelected != null) {
        onRectangleSelected(selectionRectangle);
      }
      setRectEnd(null);
    },
    [selectionRectangle, setRectEnd]
  );

  const toggleAdditive = useCallback(
    e => {
      if (e.key === "Shift") setAdditive(e.type === "keydown");
    },
    [setAdditive]
  );

  const needsSelectionListeners = selectionRectangle != null;
  useEffect(
    () => {
      if (needsSelectionListeners) {
        document.addEventListener("mousemove", updateSelectionRectangle);
        document.addEventListener("mouseup", finalizeSelectionRectangle);
        document.addEventListener("keydown", toggleAdditive);
        document.addEventListener("keyup", toggleAdditive);
      }

      return () => {
        document.removeEventListener("mousemove", updateSelectionRectangle);
        document.removeEventListener("mouseup", finalizeSelectionRectangle);
        document.removeEventListener("keydown", toggleAdditive);
        document.removeEventListener("keyup", toggleAdditive);
      };
    },
    [
      needsSelectionListeners,
      updateSelectionRectangle,
      finalizeSelectionRectangle,
      toggleAdditive
    ]
  );

  useGlobalKeyboardShortcut("Escape", cancelSelectionRectangle);

  return {
    selectionRectangle,
    startSelectionRectangle,
    cancelSelectionRectangle
  };
};
