import { useCallback } from "react";
import usePanAndZoom from "./usePanAndZoom";

export default (ref, { objectAtPoint, onSelect, onBackgroundClicked }) => {
  const canBeginGesture = useCallback(
    ({ type, button, offsetX, offsetY }, graphCoords) => {
      if (type !== "mousedown" || button !== 0) return true;

      const object = objectAtPoint(graphCoords);

      if (!object) return true;

      onSelect(object);

      return false;
    },
    [objectAtPoint, onSelect]
  );

  return usePanAndZoom(ref, { canBeginGesture, onBackgroundClicked });
};
