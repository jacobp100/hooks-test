import React, { useReducer, useRef } from "react";
import Canvas from "../Canvas";
import Button from "../Button";
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

// So we can ctrl+click on Mac
const cancelContextMenu = e => e.preventDefault();

const applySeletion = (treeLayout, rect) =>
  store.setSelected(treeLayout.nodesInRect(rect), rect.additive);

const previewSelection = (state, treeLayout, selectionRectangle) =>
  selectionRectangle != null
    ? store.reducer(state, applySeletion(treeLayout, selectionRectangle))
        .selected
    : state.selected;

export default () => {
  const ref = useRef(null);
  const [state, dispatch] = useReducer(store.reducer, store.defaultState);

  const treeLayout = useTreeLayout(state.nodes);
  const { canvasOrigin, selectionRectangle } = useGestureHandlers(ref, {
    objectAtPoint: treeLayout.nodeAtPoint,
    onSelect: (node, additive) => dispatch(store.setSelected([node], additive)),
    onRectangleSelected: rect => dispatch(applySeletion(treeLayout, rect)),
    onBackgroundClicked: () => dispatch(store.clearSelected())
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

  const selected = previewSelection(state, treeLayout, selectionRectangle);
  const canvasState = { root: treeLayout.root, selected, selectionRectangle };
  useCanvasDrawer(ref, drawGraph, viewport, canvasState, canvasOrigin, t);

  return (
    <div>
      <Canvas ref={ref} viewport={viewport} onContextMenu={cancelContextMenu} />
      <ZoomButtons zoomHandlers={zoomHandlers} />
      <br />
      {selected.length > 1 ? (
        <span>{selected.length} nodes selected</span>
      ) : selected.length === 1 ? (
        <>
          <span>{selected[0]}</span>
          <Button
            onClick={() => dispatch(store.addChildToSelected())}
            title="Add Child"
          />
        </>
      ) : (
        <span>No node selected</span>
      )}
    </div>
  );
};
