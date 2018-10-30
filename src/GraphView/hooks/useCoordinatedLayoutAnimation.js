import { useMemo } from "react";
import { tween, value } from "popmotion";
import { getX, getY } from "../../graph/treeLayout";

const createT = () => value(1);

export default (
  canvasOrigin,
  { idMap, addedNodes, removedNodes },
  zoomHandlers
) => {
  const t = useMemo(createT);

  if (addedNodes.length === 1 && removedNodes.length === 0) {
    // Keep parent in same position on screen
    const d = idMap.get(addedNodes[0]).parent;
    const initialCanvasOrigin = canvasOrigin.get();
    const z = initialCanvasOrigin.zoom;
    const initialX = getX(d, 0) * z;
    const initialY = getY(d, 0) * z;
    const initialZoom = initialCanvasOrigin.zoom;

    const animation = tween({ from: 0, to: 1 });
    animation
      .pipe(t => ({
        x: initialCanvasOrigin.x + -(getX(d, t) * z - initialX),
        y: initialCanvasOrigin.y + -(getY(d, t) * z - initialY),
        zoom: initialZoom
      }))
      .start(canvasOrigin);
    animation.pipe(x => x).start(t);
  } else if (addedNodes.length !== 0 || removedNodes.length !== 0) {
    zoomHandlers.resetZoom();
  }

  return t;
};
