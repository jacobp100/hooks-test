import { useCallback } from "react";
import useZoomHandlers from "./useZoomHandlers";
import { treeBounds } from "./treeLayout";

export default (root, viewport, canvasOrigin) => {
  const { zoomIn, zoomOut, zoomToRect } = useZoomHandlers(
    viewport,
    canvasOrigin
  );
  const resetZoom = useCallback(opts => zoomToRect(treeBounds(root), opts), [
    zoomToRect,
    treeBounds
  ]);

  return { zoomIn, zoomOut, resetZoom };
};
