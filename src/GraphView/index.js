import React, { useReducer, useRef } from "react";
import Canvas from "../Canvas";
import Button from "../Button";
import usePopmotionValue from "../animation/usePopmotionValue";
import drawGraph from "../graph/drawGraph";
import useTreeLayout from "../graph/useTreeLayout";
import useCanvasDrawer from "./hooks/useCanvasDrawer";
import useGestureHandlers from "./hooks/useGestureHandlers";
import useZoomHandlersWithTreeLayout from "./hooks/useZoomHandlersWithTreeLayout";
import useZoomKeyboardShortcuts from "./hooks/useZoomKeyboardShortcuts";
import useZoomResetOnMount from "./hooks/useZoomResetOnMount";
import coordinateLayoutAnimation from "./coordinateLayoutAnimation";
import * as store from "./store";
import ZoomButtons from "./ZoomButtons";

const viewport = {
  width: 500,
  height: 500,
  scale: window.devicePixelRatio
};

// So we can ctrl+click on Mac
const cancelContextMenu = e => e.preventDefault();

const applySeletion = (tree, rect) =>
  store.setSelected(tree.nodesInRect(rect), rect.additive);

const previewSelection = (state, tree, selectionRectangle) =>
  selectionRectangle != null
    ? store.reducer(state, applySeletion(tree, selectionRectangle)).selected
    : state.selected;

export default () => {
  const ref = useRef(null);
  const [state, dispatch] = useReducer(store.reducer, store.defaultState);

  const t = usePopmotionValue(1); // Global layout animation for the graph (t is d3 convention)
  const tree = useTreeLayout(state.nodes, {
    onLayout: params =>
      coordinateLayoutAnimation(t, camera, zoomHandlers, tree, params)
  });
  const { camera, selectionRectangle } = useGestureHandlers(ref, {
    objectAtPoint: tree.nodeAtPoint,
    onSelect: (node, additive) => dispatch(store.setSelected([node], additive)),
    onRectangleSelected: rect => dispatch(applySeletion(tree, rect)),
    onBackgroundClicked: () => dispatch(store.clearSelected())
  });
  const zoomHandlers = useZoomHandlersWithTreeLayout(viewport, camera, tree);
  useZoomKeyboardShortcuts(zoomHandlers);
  useZoomResetOnMount(zoomHandlers);

  const selected = previewSelection(state, tree, selectionRectangle);
  const canvasParams = { root: tree.root, selected, selectionRectangle };
  useCanvasDrawer(ref, drawGraph, viewport, canvasParams, camera, t);

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
