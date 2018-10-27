import { useRef, useEffect, useCallback } from "react";
import { value, physics } from "popmotion";
import useD3Zoom from "./useD3Zoom";
import useMomentumPanning from "./useMomentumPanning";

export default (ref, updater) => {
  const coordinates = useRef(null);
  if (coordinates.current === null) {
    coordinates.current = value({
      x: 0,
      y: 0,
      zoom: 1
    });
  }

  const runPanAnimation = useCallback(({ xVelocity, yVelocity }) => {
    physics({
      from: coordinates.current.get(),
      velocity: { x: xVelocity, y: yVelocity, zoom: 0 },
      friction: 0.3
    }).start(coordinates.current);
  }, []);

  const momentumPanning = useMomentumPanning(runPanAnimation);

  const onStartZoom = useCallback(() => {
    coordinates.current.stop();
    momentumPanning.start();
  }, []);
  const onZoom = useCallback(coords => {
    coordinates.current.stop();
    coordinates.current.update(coords);
    momentumPanning.addPoint(coords);
  }, []);
  const onEndZoom = useCallback(() => {
    momentumPanning.end();
  }, []);
  const setD3Coordinates = useD3Zoom(ref, { onStartZoom, onZoom, onEndZoom });

  useEffect(() => coordinates.current.subscribe(setD3Coordinates).unsubscribe, [
    setD3Coordinates
  ]);
  useEffect(() => coordinates.current.subscribe(updater).unsubscribe, [
    updater
  ]);

  return coordinates.current;
};
