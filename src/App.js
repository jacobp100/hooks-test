import React, { useRef, useCallback } from "react";
import { tween } from "popmotion";
import useCanvasDrawer from "./useCanvasDrawer";
import usePopmotionD3Zoom from "./usePopmotionD3Zoom";
import drawMap from "./drawMap";
import zoomFromCentre from "./zoomFromCentre";

const width = 500;
const height = 500;
const scale = window.devicePixelRatio;

export default () => {
  const ref = useRef(null);

  const updateCanvas = useCanvasDrawer(ref, drawMap, { width, height, scale });
  const coordinates = usePopmotionD3Zoom(ref, updateCanvas);

  const zoom = useCallback(scale => {
    tween({
      from: coordinates.get(),
      to: zoomFromCentre(width, height, scale, coordinates)
    }).start(coordinates);
  }, []);

  const resetZoom = useCallback(() => {
    tween({
      from: coordinates.get(),
      to: { x: 0, y: 0, zoom: 1 }
    }).start(coordinates);
  }, []);

  return (
    <React.Fragment>
      <canvas
        ref={ref}
        style={{ display: "block", width, height }}
        width={width * scale}
        height={height * scale}
      />
      <button type="button" onClick={() => zoom(1.5)}>
        Zoom In
      </button>
      <button type="button" onClick={() => zoom(1 / 1.5)}>
        Zoom Out
      </button>
      <button type="button" onClick={resetZoom}>
        Reset Zoom
      </button>
    </React.Fragment>
  );
};
