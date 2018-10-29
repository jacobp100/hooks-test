import { useMemo } from "react";
import { tween } from "popmotion";
import useRefValue from "./useRefValue";
import zoomFromCentre from "./zoomFromCentre";

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

  const zoomBy = (scale, { animated } = {}) =>
    setZoom(
      zoomFromCentre(viewportRef.current, scale, coordinatesRef.current),
      animated
    );
  const zoomIn = opts => zoomBy(1.5, opts);
  const zoomOut = opts => zoomBy(1 / 1.5, opts);

  const zoomToRect = (rect, { padding = 50, animated } = {}) => {
    const zoom = Math.min(
      (viewportRef.current.width - 2 * padding) / rect.width,
      (viewportRef.current.height - 2 * padding) / rect.height
    );
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
