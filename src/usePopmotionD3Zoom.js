import { useRef, useCallback } from "react";
import { value, physics } from "popmotion";
import usePopmotionOutput from "./usePopmotionOutput";
import useD3Zoom from "./useD3Zoom";
import useMomentumPanning from "./useMomentumPanning";

export default ref => {
  const coordinatesRef = useRef(null);
  if (coordinatesRef.current === null) {
    coordinatesRef.current = value({
      x: 0,
      y: 0,
      zoom: 1
    });
  }
  // Never changes
  const coordinates = coordinatesRef.current;

  const runPanAnimation = useCallback(
    ({ xVelocity, yVelocity }) => {
      physics({
        from: coordinates.get(),
        velocity: { x: xVelocity, y: yVelocity, zoom: 0 },
        friction: 0.3
      }).start(coordinates);
    },
    [coordinates]
  );

  const momentumPanning = useMomentumPanning(runPanAnimation);

  const onStartZoom = useCallback(
    () => {
      coordinates.stop();
      momentumPanning.start();
    },
    [coordinates, momentumPanning]
  );
  const onZoom = useCallback(
    coords => {
      coordinates.stop();
      coordinates.update(coords);
      momentumPanning.addPoint(coords);
    },
    [coordinates, momentumPanning]
  );
  const onEndZoom = useCallback(
    () => {
      momentumPanning.end();
    },
    [coordinates, momentumPanning]
  );
  const setD3Coordinates = useD3Zoom(ref, { onStartZoom, onZoom, onEndZoom });

  usePopmotionOutput(coordinates, setD3Coordinates);

  return coordinates;
};
