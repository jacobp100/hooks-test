import { tween } from "popmotion";
import { getX, getY } from "../graph/treeLayout";

const animateMaintainingNodeCanvasPosition = (t, camera, d) => {
  const initialcamera = camera.get();
  const z = initialcamera.zoom;
  const initialX = getX(d, 0) * z;
  const initialY = getY(d, 0) * z;
  const initialZoom = initialcamera.zoom;

  /*
  Not too sure why this is needed. In the case the tree changes, we unsubscribe the render callback
  from value updates, start this layout animation, and then re-subscribe the render callback to
  value updates.

  This isn't really a documented method, but neither is `update`.
  */
  t.updateCurrent(0);

  const animation = tween({ from: 0, to: 1 });
  animation
    .pipe(t => ({
      x: initialcamera.x - (getX(d, t) * z - initialX),
      y: initialcamera.y - (getY(d, t) * z - initialY),
      zoom: initialZoom
    }))
    .start(camera);
  animation.pipe(x => x).start(t);
};

const animateLayoutChange = (t, camera, zoomHandlers) => {
  t.updateCurrent(0);
  const animation = tween({ from: 0, to: 1 });
  animation.start(t);
  zoomHandlers.resetZoom({ animation });
};

export default (t, camera, zoomHandlers, treeLayout, layout) => {
  const added = layout.addedNodes.length;
  const removed = layout.removedNodes.length;
  const moved = layout.movedNodes.length;

  if (added === 1 && moved === 0 && removed === 0) {
    // Keep parent in same position on screen
    const d = treeLayout.idMap.get(layout.addedNodes[0]).parent;
    animateMaintainingNodeCanvasPosition(t, camera, d);
  } else if (added !== 0 || removed !== 0 || moved !== 0) {
    animateLayoutChange(t, camera, zoomHandlers);
  }
};
