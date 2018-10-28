import { useMemo } from "react";
import { tween } from "popmotion";
import useRefValue from "./useRefValue";
import zoomFromCentre from "./zoomFromCentre";

const createApi = (viewportRef, coordinatesRef) => {
  const zoomBy = scale => {
    tween({
      from: coordinatesRef.current.get(),
      to: zoomFromCentre(viewportRef.current, scale, coordinatesRef.current)
    }).start(coordinatesRef.current);
  };
  const zoomIn = () => zoomBy(1.5);
  const zoomOut = () => zoomBy(1 / 1.5);

  const resetZoom = () => {
    tween({
      from: coordinatesRef.current.get(),
      to: { x: 0, y: 0, zoom: 1 }
    }).start(coordinatesRef.current);
  };

  return { zoomBy, zoomIn, zoomOut, resetZoom };
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
