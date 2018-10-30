import { useMemo } from "react";
import { value, physics } from "popmotion";
import { useMulticastOutput } from "./usePopmotionOutput";
import useD3Zoom from "./useD3Zoom";
import createMomentumPanLogger from "./gestures/createMomentumPanLogger";

const createInitialValue = () => value({ x: 0, y: 0, zoom: 1 });

export default (ref, handlers) => {
  const canvasOrigin = useMemo(createInitialValue);
  const momentumRecognizer = useMemo(createMomentumPanLogger);

  const { setTransform } = useD3Zoom(ref, {
    filter: handlers.filter,
    onStartZoom(e) {
      canvasOrigin.stop();
      momentumRecognizer.begin();
      const { onStartZoom } = handlers;
      if (onStartZoom != null) onStartZoom(e);
    },
    onZoom(e) {
      const { x, y, k } = e.transform;
      const coords = { x, y, zoom: k };
      canvasOrigin.stop();
      canvasOrigin.update(coords);
      momentumRecognizer.update(coords);

      const { onZoom } = handlers;
      if (onZoom != null) onZoom(e);
    },
    onEndZoom(e) {
      const velocity = momentumRecognizer.finalize();
      if (velocity != null) {
        physics({
          from: canvasOrigin.get(),
          velocity: { x: velocity.x, y: velocity.y, zoom: 0 },
          friction: 0.3
        }).start(canvasOrigin);
      }

      const { onEndZoom } = handlers;
      if (onEndZoom != null) onEndZoom(e);
    }
  });

  useMulticastOutput(canvasOrigin, setTransform);

  return canvasOrigin;
};
