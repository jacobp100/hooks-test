import { useRef, useEffect, useCallback } from "react";
import { value } from "popmotion";
import useD3Zoom from "./useD3Zoom";

export default (ref, updater) => {
  const coordinates = useRef(null);
  if (coordinates.current === null) {
    coordinates.current = value({
      x: 0,
      y: 0,
      zoom: 1
    });
  }

  const updateCoordinates = useCallback(c => {
    coordinates.current.stop();
    coordinates.current.update(c);
  }, []);
  const setD3Coordinates = useD3Zoom(ref, updateCoordinates);

  useEffect(() => coordinates.current.subscribe(setD3Coordinates).unsubscribe, [
    setD3Coordinates
  ]);
  useEffect(() => coordinates.current.subscribe(updater).unsubscribe, [
    updater
  ]);

  return coordinates.current;
};
