import { useMemo, useCallback, useState } from "react";
import useGlobalKeyboardShortcut from "../../../hooks/useGlobalKeyboardShortcut";
import { getGraphCoordinatesForEvent } from "../../../graph/canvasUtil";
import useRectEnd from "./useRectEnd";
import useAdditive from "./useAdditive";
import createSelectionRectangle from "./createSelectionRectangle";

export default (ref, camera, { onRectangleSelected } = {}) => {
  const [rectStart, setRectStart] = useState(null);
  const isInteractive = rectStart != null;
  const [rectEnd, setRectEnd] = useRectEnd(ref, camera, isInteractive, {
    onComplete() {
      if (selectionRectangle != null && onRectangleSelected != null) {
        onRectangleSelected(selectionRectangle);
      }
      cancelSelectionRectangle();
    }
  });
  const [additive, setAdditive] = useAdditive(isInteractive);
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

  const cancelSelectionRectangle = useCallback(
    () => {
      setRectStart(null);
      setRectEnd(null);
      setAdditive(false);
    },
    [setRectStart, setRectEnd, setAdditive]
  );

  useGlobalKeyboardShortcut("Escape", cancelSelectionRectangle);

  return {
    selectionRectangle,
    startSelectionRectangle,
    cancelSelectionRectangle
  };
};
