import { useCallback, useMemo } from "react";
import { value, physics } from "popmotion";
import usePopmotionOutput from "./usePopmotionOutput";
import useD3Zoom from "./useD3Zoom";
import createMomentumPanLogger from "./createMomentumPanLogger";

const createInitialValue = () => value({ x: 0, y: 0, zoom: 1 });

export default ref => {
  const coordinates = useMemo(createInitialValue);
  const momentumPanning = useMemo(createMomentumPanLogger);

  const onStartZoom = useCallback(
    () => {
      coordinates.stop();
      momentumPanning.reset();
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
      const velocity = momentumPanning.finalize();
      if (velocity != null) {
        physics({
          from: coordinates.get(),
          velocity: { x: velocity.x, y: velocity.y, zoom: 0 },
          friction: 0.3
        }).start(coordinates);
      }
    },
    [coordinates, momentumPanning]
  );
  const setD3Coordinates = useD3Zoom(ref, { onStartZoom, onZoom, onEndZoom });

  usePopmotionOutput(coordinates, setD3Coordinates);

  return coordinates;
};
