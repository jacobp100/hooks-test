import { useMemo } from "react";
import { tween } from "popmotion";
import useRefValue from "../hooks/useRefValue";

const createApi = (viewportRef, coordinatesRef) => {
  const setZoom = (to, animated = true) => {
    if (animated) {
      tween({ from: coordinatesRef.current.get(), to }).start(
        coordinatesRef.current
      );
    } else {
      coordinatesRef.current.update(to);
    }
  };

  const zoomBy = (scale, { animated } = {}) => {
    const { width, height } = viewportRef.current;
    const current = coordinatesRef.current.get();
    const x = (current.x - width / 2) * scale + width / 2;
    const y = (current.y - width / 2) * scale + height / 2;
    const zoom = current.zoom * scale;

    setZoom({ x, y, zoom }, animated);
  };
  const zoomIn = opts => zoomBy(1.5, opts);
  const zoomOut = opts => zoomBy(1 / 1.5, opts);

  const zoomToRect = (rect, { padding = 50, animated } = {}) => {
    const { width, height } = viewportRef.current;
    let zoom = Math.min(
      (width - 2 * padding) / rect.width,
      (height - 2 * padding) / rect.height
    );
    if (!isFinite(zoom)) zoom = 1;
    const x = viewportRef.current.width / 2 - (rect.x + rect.width / 2) * zoom;
    const y =
      viewportRef.current.height / 2 - (rect.y + rect.height / 2) * zoom;
    setZoom({ x, y, zoom }, animated);
  };

  return { zoomBy, zoomIn, zoomOut, zoomToRect };
};

export default (viewport, coordinates) => {
  const viewportRef = useRefValue(viewport);
  const coordinatesRef = useRefValue(coordinates);
  const api = useMemo(() => createApi(viewportRef, coordinatesRef), [
    viewportRef,
    coordinatesRef
  ]);

  return api;
};
