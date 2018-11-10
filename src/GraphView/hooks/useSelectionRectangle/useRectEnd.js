import { useCallback, useState, useEffect } from "react";
import { canvasCoordsToGraphCoords } from "../../../graph/canvasUtil";

export default (ref, camera, isInteractive, { onComplete } = {}) => {
  const [rectEnd, setRectEnd] = useState(null);

  const updateSelectionRectangle = useCallback(
    e => {
      const origin = ref.current.getBoundingClientRect();
      const canvasCoords = { x: e.pageX - origin.x, y: e.pageY - origin.y };
      const graphCoords = canvasCoordsToGraphCoords(camera.get(), canvasCoords);
      setRectEnd(graphCoords);
    },
    [setRectEnd]
  );

  const finalizeSelectionRectangle = useCallback(
    () => {
      onComplete();
    },
    [setRectEnd, onComplete]
  );

  useEffect(
    () => {
      if (!isInteractive) return null;

      document.addEventListener("mousemove", updateSelectionRectangle);
      document.addEventListener("mouseup", finalizeSelectionRectangle);

      return () => {
        document.removeEventListener("mousemove", updateSelectionRectangle);
        document.removeEventListener("mouseup", finalizeSelectionRectangle);
      };
    },
    [isInteractive, updateSelectionRectangle, finalizeSelectionRectangle]
  );

  return [rectEnd, setRectEnd];
};
