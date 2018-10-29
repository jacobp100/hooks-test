import { useCallback, useMemo } from "react";
import { value, physics } from "popmotion";
import usePopmotionOutput from "./usePopmotionOutput";
import useD3Zoom from "./useD3Zoom";
import createClickRecognizer from "./createClickRecognizer";
import createMomentumPanLogger from "./createMomentumPanLogger";
import { canvasCoordsToGraphCoords } from "./canvasUtil";

const createInitialValue = () => value({ x: 0, y: 0, zoom: 1 });

export default (ref, { canBeginGesture, onBackgroundClicked }) => {
  const canvasOrigin = useMemo(createInitialValue);
  const clickRecognizer = useMemo(createClickRecognizer);
  const momentumPanning = useMemo(createMomentumPanLogger);

  const filter = useCallback(
    event => {
      const canvasCoords = { x: event.offsetX, y: event.offsetY };
      const graphCoords = canvasCoordsToGraphCoords(
        canvasOrigin.get(),
        canvasCoords
      );
      return canBeginGesture ? canBeginGesture(event, graphCoords) : true;
    },
    [canvasOrigin, canBeginGesture]
  );
  const onStartZoom = useCallback(
    () => {
      canvasOrigin.stop();
      clickRecognizer.reset();
      momentumPanning.reset();
    },
    [canvasOrigin, clickRecognizer, momentumPanning]
  );
  const onZoom = useCallback(
    event => {
      const { x, y, k } = event.transform;
      const coords = { x, y, zoom: k };
      canvasOrigin.stop();
      canvasOrigin.update(coords);

      clickRecognizer.addPoint(coords);
      momentumPanning.addPoint(coords);
    },
    [canvasOrigin, clickRecognizer, momentumPanning]
  );
  const onEndZoom = useCallback(
    () => {
      if (clickRecognizer.finalize()) {
        onBackgroundClicked();
      }

      const velocity = momentumPanning.finalize();
      if (velocity != null) {
        physics({
          from: canvasOrigin.get(),
          velocity: { x: velocity.x, y: velocity.y, zoom: 0 },
          friction: 0.3
        }).start(canvasOrigin);
      }
    },
    [canvasOrigin, clickRecognizer, momentumPanning]
  );
  const { setTransform } = useD3Zoom(ref, {
    filter,
    onStartZoom,
    onZoom,
    onEndZoom
  });

  usePopmotionOutput(canvasOrigin, setTransform);

  return canvasOrigin;
};
