import React, { useRef } from "react";
import Canvas from "../Canvas";
import Button from "../Button";
import useStore from "../hooks/useStore";
import drawGraph from "../graph/drawGraph";
import useTreeLayoutWithAnimation from "./hooks/useTreeLayoutWithAnimation";
import useCanvasDrawer from "./hooks/useCanvasDrawer";
import useGestureHandlers from "./hooks/useGestureHandlers";
import useZoomHandlersWithTreeLayout from "./hooks/useZoomHandlersWithTreeLayout";
import useZoomKeyboardShortcuts from "./hooks/useZoomKeyboardShortcuts";
import useZoomResetOnMount from "./hooks/useZoomResetOnMount";
import * as store from "./store";

const viewport = {
  width: 500,
  height: 500,
  scale: window.devicePixelRatio
};

export default () => {
  const ref = useRef(null);
  const { state, setSelected, clearSelected, addChildToSelected } = useStore(store);
  const { selected, nodes } = state;

  const { root, nodeAtPoint, t } = useTreeLayoutWithAnimation(nodes);
  const { canvasOrigin } = useGestureHandlers(ref, {
    objectAtPoint: nodeAtPoint,
    onSelect: setSelected,
    onBackgroundClicked: clearSelected
  });
  const zoomState = { root, viewport, canvasOrigin };
  const zoomHandlers = useZoomHandlersWithTreeLayout(zoomState);
  useZoomKeyboardShortcuts(zoomHandlers);
  useZoomResetOnMount(zoomHandlers);

  const canvasState = { selected, root };
  useCanvasDrawer(ref, drawGraph, viewport, canvasState, canvasOrigin, t);

  return (
    <div>
      <Canvas ref={ref} viewport={viewport} />
      <Button onClick={zoomHandlers.zoomIn} title="Zoom In" />
      <Button onClick={zoomHandlers.zoomOut} title="Zoom Out" />
      <Button onClick={zoomHandlers.resetZoom} title="Zoom to Fit" />
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
