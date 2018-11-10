import { useMemo } from "react";
import { tween } from "popmotion";

const createApi = (viewport, camera) => {
  const setCamera = (to, animated = true) => {
    if (animated) {
      tween({ from: camera.get(), to }).start(camera);
    } else {
      camera.update(to);
    }
  };

  const zoomBy = (scale, { animated } = {}) => {
    const { width, height } = viewport;
    const current = camera.get();
    const x = (current.x - width / 2) * scale + width / 2;
    const y = (current.y - width / 2) * scale + height / 2;
    const zoom = current.zoom * scale;

    setCamera({ x, y, zoom }, animated);
  };
  const zoomIn = opts => zoomBy(1.5, opts);
  const zoomOut = opts => zoomBy(1 / 1.5, opts);

  const zoomToRect = (rect, { padding = 50, animated } = {}) => {
    const { width, height } = viewport;
    let zoom = Math.min(
      (width - 2 * padding) / rect.width,
      (height - 2 * padding) / rect.height
    );
    if (!isFinite(zoom)) zoom = 1;
    const x = viewport.width / 2 - (rect.x + rect.width / 2) * zoom;
    const y = viewport.height / 2 - (rect.y + rect.height / 2) * zoom;
    setCamera({ x, y, zoom }, animated);
  };

  return { zoomBy, zoomIn, zoomOut, zoomToRect };
};

export default (viewport, camera) =>
  useMemo(() => createApi(viewport, camera), [viewport, camera]);
