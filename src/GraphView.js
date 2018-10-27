import React, { useState, useRef } from "react";
import Canvas from "./Canvas";
import Button from "./Button";
import useCanvasDrawer from "./useCanvasDrawer";
import usePopmotionD3Zoom from "./usePopmotionD3Zoom";
import usePopmotionOutput from "./usePopmotionOutput";
import useZoomHandlers from "./useZoomHandlers";
import useGlobalKeyboardShortcut from "./useGlobalKeyboardShortcut";
import drawMap from "./drawMap";

const viewport = {
  width: 500,
  height: 500,
  scale: window.devicePixelRatio
};

export default () => {
  const ref = useRef(null);
  const [color, setColor] = useState("black");

  const updateCanvas = useCanvasDrawer(ref, drawMap, viewport, color);
  const coordinates = usePopmotionD3Zoom(ref);
  usePopmotionOutput(coordinates, updateCanvas);
  const { zoomIn, zoomOut, resetZoom } = useZoomHandlers(viewport, coordinates);

  useGlobalKeyboardShortcut("=", zoomIn);
  useGlobalKeyboardShortcut("-", zoomOut);
  useGlobalKeyboardShortcut("0", resetZoom);

  return (
    <div>
      <Canvas ref={ref} viewport={viewport} />
      <Button onClick={zoomIn} title="Zoom In" />
      <Button onClick={zoomOut} title="Zoom Out" />
      <Button onClick={resetZoom} title="Reset Zoom" />
      <br />
      <Button onClick={() => setColor("red")} title="Red" />
      <Button onClick={() => setColor("green")} title="Green" />
      <Button onClick={() => setColor("blue")} title="Blue" />
      <Button onClick={() => setColor("black")} title="Black" />
    </div>
  );
};
