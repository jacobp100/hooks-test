import { useCallback } from "react";
import useZoomHandlers from "../../animation/useZoomHandlers";
import { treeBounds } from "../../graph/treeLayout";

export default (viewport, camera, tree) => {
  const { root } = tree;
  const { zoomIn, zoomOut, zoomToRect } = useZoomHandlers(viewport, camera);
  const resetZoom = useCallback(opts => zoomToRect(treeBounds(root), opts), [
    zoomToRect,
    root
  ]);

  return { zoomIn, zoomOut, resetZoom };
};
