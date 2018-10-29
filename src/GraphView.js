import React, { useEffect, useRef } from "react";
import Canvas from "./Canvas";
import Button from "./Button";
import useTreeLayoutWithAnimation from "./useTreeLayoutWithAnimation";
import useCanvasDrawer from "./useCanvasDrawer";
import usePanAndZoomWithObjectDetection from "./usePanAndZoomWithObjectDetection";
import useZoomHandlersWithTreeLayout from "./useZoomHandlersWithTreeLayout";
import useGlobalKeyboardShortcut from "./useGlobalKeyboardShortcut";
import drawGraph from "./drawGraph";
import useStore from "./useStore";

const viewport = {
  width: 500,
  height: 500,
  scale: window.devicePixelRatio
};

export default () => {
  const ref = useRef(null);
  const { state, setSelected, clearSelected, addChildToSelected } = useStore();
  const { selected, nodes } = state;

  const { root, nodeAtPoint, t } = useTreeLayoutWithAnimation(nodes);
  const canvasOrigin = usePanAndZoomWithObjectDetection(ref, {
    objectAtPoint: nodeAtPoint,
    onSelect: setSelected,
    onBackgroundClicked: clearSelected
  });
  const { zoomIn, zoomOut, resetZoom } = useZoomHandlersWithTreeLayout(
    root,
    viewport,
    canvasOrigin
  );

  const canvasState = { selected, root };
  useCanvasDrawer(ref, drawGraph, viewport, canvasState, canvasOrigin, t);

  useGlobalKeyboardShortcut("=", zoomIn);
  useGlobalKeyboardShortcut("-", zoomOut);
  useGlobalKeyboardShortcut("0", resetZoom);

  useEffect(() => resetZoom({ animated: false }), []);

  return (
    <div>
      <Canvas ref={ref} viewport={viewport} />
      <Button onClick={zoomIn} title="Zoom In" />
      <Button onClick={zoomOut} title="Zoom Out" />
      <Button onClick={resetZoom} title="Zoom to Fit" />
      <br />
      {selected != null ? (
        <>
          <span>{selected}</span>
          <Button onClick={addChildToSelected} title="Add Child" />
        </>
      ) : (
        <span>No node selected</span>
      )}
    </div>
  );
};
