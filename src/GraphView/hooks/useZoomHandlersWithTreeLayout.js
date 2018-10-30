import { useCallback } from "react";
import useZoomHandlers from "../../animation/useZoomHandlers";
import { treeBounds } from "../../graph/treeLayout";

export default ({ root, viewport, canvasOrigin }) => {
  const { zoomIn, zoomOut, zoomToRect } = useZoomHandlers(
    viewport,
    canvasOrigin
  );
  const resetZoom = useCallback(opts => zoomToRect(treeBounds(root), opts), [
    zoomToRect,
    root
  ]);

  return { zoomIn, zoomOut, resetZoom };
};
