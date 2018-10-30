import React, { useRef } from "react";
import Canvas from "../Canvas";
import Button from "../Button";
import useStore from "../hooks/useStore";
import drawGraph from "../graph/drawGraph";
import useTreeLayout from "../graph/useTreeLayout";
import useCanvasDrawer from "./hooks/useCanvasDrawer";
import useCoordinatedLayoutAnimation from "./hooks/useCoordinatedLayoutAnimation";
import useGestureHandlers from "./hooks/useGestureHandlers";
import useZoomHandlersWithTreeLayout from "./hooks/useZoomHandlersWithTreeLayout";
import useZoomKeyboardShortcuts from "./hooks/useZoomKeyboardShortcuts";
import useZoomResetOnMount from "./hooks/useZoomResetOnMount";
import * as store from "./store";
import ZoomButtons from "./ZoomButtons";

const viewport = {
  width: 500,
  height: 500,
  scale: window.devicePixelRatio
};

export default () => {
  const ref = useRef(null);
  const { state, setSelected, clearSelected, addChildToSelected } = useStore(
    store
  );
  const { selected, nodes } = state;

  const treeLayout = useTreeLayout(nodes);
  const { canvasOrigin } = useGestureHandlers(ref, {
    objectAtPoint: treeLayout.nodeAtPoint,
    onSelect: setSelected,
    onBackgroundClicked: clearSelected
  });
  const zoomState = { root: treeLayout.root, viewport, canvasOrigin };
  const zoomHandlers = useZoomHandlersWithTreeLayout(zoomState);
  useZoomKeyboardShortcuts(zoomHandlers);
  useZoomResetOnMount(zoomHandlers);

  const t = useCoordinatedLayoutAnimation(
    canvasOrigin,
    treeLayout,
    zoomHandlers
  );

  const canvasState = { root: treeLayout.root, selected };
  useCanvasDrawer(ref, drawGraph, viewport, canvasState, canvasOrigin, t);

  return (
    <div>
      <Canvas ref={ref} viewport={viewport} />
      <ZoomButtons zoomHandlers={zoomHandlers} />
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
