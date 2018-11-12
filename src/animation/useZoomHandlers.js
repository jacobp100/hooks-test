import { useMemo } from "react";
import { tween } from "popmotion";

const createApi = (viewport, camera) => {
  const setCamera = (to, animation = true) => {
    if (animation === true) {
      tween({ from: camera.get(), to }).start(camera);
    } else if (animation === false) {
      camera.update(to);
    } else if (animation != null) {
      const from = camera.get();
      animation
        .pipe(t => ({
          x: (to.x - from.x) * t + from.x,
          y: (to.y - from.y) * t + from.y,
          zoom: (to.zoom - from.zoom) * t + from.zoom
        }))
        .start(camera);
    }
  };

  const zoomBy = (scale, { animation } = {}) => {
    const { width, height } = viewport;
    const current = camera.get();
    const x = (current.x - width / 2) * scale + width / 2;
    const y = (current.y - width / 2) * scale + height / 2;
    const zoom = current.zoom * scale;

    setCamera({ x, y, zoom }, animation);
  };
  const zoomIn = opts => zoomBy(1.5, opts);
  const zoomOut = opts => zoomBy(1 / 1.5, opts);

  const zoomToRect = (rect, { padding = 50, animation } = {}) => {
    const { width, height } = viewport;
    let zoom = Math.min(
      (width - 2 * padding) / rect.width,
      (height - 2 * padding) / rect.height
    );
    if (!isFinite(zoom)) zoom = 1;
    const x = viewport.width / 2 - (rect.x + rect.width / 2) * zoom;
    const y = viewport.height / 2 - (rect.y + rect.height / 2) * zoom;
    setCamera({ x, y, zoom }, animation);
  };

  return { zoomBy, zoomIn, zoomOut, zoomToRect };
};

export default (viewport, camera) =>
  useMemo(() => createApi(viewport, camera), [viewport, camera]);
