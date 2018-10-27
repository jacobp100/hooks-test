import { useRef, useCallback } from "react";
import { tween } from "popmotion";
import zoomFromCentre from "./zoomFromCentre";

const createApi = (viewportRef, coordinatesRef) => {
  const zoomBy = useCallback(scale => {
    tween({
      from: coordinatesRef.current.get(),
      to: zoomFromCentre(viewportRef.current, scale, coordinatesRef.current)
    }).start(coordinatesRef.current);
  }, []);
  const zoomIn = useCallback(() => zoomBy(1.5), []);
  const zoomOut = useCallback(() => zoomBy(1 / 1.5), []);

  const resetZoom = useCallback(() => {
    tween({
      from: coordinatesRef.current.get(),
      to: { x: 0, y: 0, zoom: 1 }
    }).start(coordinatesRef.current);
  }, []);

  return { zoomBy, zoomIn, zoomOut, resetZoom };
};

export default (viewport, coordinates) => {
  const viewportRef = useRef(null);
  viewportRef.current = viewport;
  const coordinatesRef = useRef(null);
  coordinatesRef.current = coordinates;

  const apiRef = useRef(null);
  if (apiRef.current == null) {
    apiRef.current = createApi(viewportRef, coordinatesRef);
  }

  return apiRef.current;
};
