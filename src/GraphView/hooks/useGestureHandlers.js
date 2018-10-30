import { useMemo } from "react";
import useSelectionRectangle from "./useSelectionRectangle";
import useD3MomentumZoom from "../../animation/useD3MomentumZoom";
import createClickRecognizer from "../../animation/gestures/createClickRecognizer";
import {
  getCanvasCoordinatesForEvent,
  canvasCoordsToGraphCoords
} from "../../graph/canvasUtil";

const getGraphCoords = (e, canvasOrigin) => {
  const canvasCoords = getCanvasCoordinatesForEvent(e);
  return canvasCoords != null
    ? canvasCoordsToGraphCoords(canvasOrigin.get(), canvasCoords)
    : null;
};

export default (ref, { objectAtPoint, onSelect, onBackgroundClicked }) => {
  const { selectionRectangle, startSelectionRectangle } = useSelectionRectangle(
    ref
  );
  const clickRecognizer = useMemo(createClickRecognizer);

  const canvasOrigin = useD3MomentumZoom(ref, {
    filter(e) {
      if (e.type === "mousedown" && e.button === 0) {
        if (e.ctrlKey) {
          startSelectionRectangle(e);
          return false;
        }

        const graphCoords = getGraphCoords(e, canvasOrigin);
        const object =
          graphCoords != null && objectAtPoint != null
            ? objectAtPoint(graphCoords)
            : null;
        if (object != null) {
          if (onSelect != null) onSelect(object);
          return false;
        }
      }

      return true;
    },
    onStartZoom: clickRecognizer.begin,
    onZoom: clickRecognizer.update,
    onEndZoom: e => {
      const didClick = clickRecognizer.finalize();
      if (didClick && onBackgroundClicked != null) onBackgroundClicked();
    }
  });

  return { canvasOrigin, selectionRectangle };
};
