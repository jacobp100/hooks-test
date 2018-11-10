import { useMemo } from "react";
import { value, physics } from "popmotion";
import { useMulticastOutput } from "./usePopmotionOutput";
import useD3Zoom from "./useD3Zoom";
import createMomentumPanLogger from "./gestures/createMomentumPanLogger";

const createInitialValue = () => value({ x: 0, y: 0, zoom: 1 });

export default (ref, handlers) => {
  const camera = useMemo(createInitialValue);
  const momentumRecognizer = useMemo(createMomentumPanLogger);

  const { setTransform } = useD3Zoom(ref, {
    filter: handlers.filter,
    onStartZoom(e) {
      camera.stop();
      momentumRecognizer.begin();
      const { onStartZoom } = handlers;
      if (onStartZoom != null) onStartZoom(e);
    },
    onZoom(e) {
      const { x, y, k } = e.transform;
      const coords = { x, y, zoom: k };
      camera.stop();
      camera.update(coords);
      momentumRecognizer.update(coords);

      const { onZoom } = handlers;
      if (onZoom != null) onZoom(e);
    },
    onEndZoom(e) {
      const velocity = momentumRecognizer.finalize();
      if (velocity != null) {
        physics({
          from: camera.get(),
          velocity: { x: velocity.x, y: velocity.y, zoom: 0 },
          friction: 0.3
        }).start(camera);
      }

      const { onEndZoom } = handlers;
      if (onEndZoom != null) onEndZoom(e);
    }
  });

  useMulticastOutput(camera, setTransform);

  return camera;
};
