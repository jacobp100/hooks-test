import React, { useReducer, useRef } from "react";
import Canvas from "../Canvas";
import usePopmotionValue from "../animation/usePopmotionValue";
import drawGraph from "../graph/drawGraph";
import useTreeLayout from "../graph/useTreeLayout";
import { canvasCoordsToGraphCoords } from "../graph/canvasUtil";
import useCanvasDrawer from "./hooks/useCanvasDrawer";
import useGestureHandlers from "./hooks/useGestureHandlers";
import useZoomHandlersWithTreeLayout from "./hooks/useZoomHandlersWithTreeLayout";
import useZoomKeyboardShortcuts from "./hooks/useZoomKeyboardShortcuts";
import useZoomResetOnMount from "./hooks/useZoomResetOnMount";
import { useDnd, connectDnd } from "./hooks/dnd";
import coordinateLayoutAnimation from "./coordinateLayoutAnimation";
import * as store from "./store";
import { applySeletion, previewSelection } from "./selectionUtil";
import ZoomButtons from "./ZoomButtons";
import Selection from "./Selection";

const viewport = {
  width: 500,
  height: 500,
  scale: window.devicePixelRatio
};

// So we can ctrl+click on Mac
const cancelContextMenu = e => e.preventDefault();

const GraphView = React.forwardRef((props, imperativeMethods) => {
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
  const canvasParams = { tree, selected, selectionRectangle };
  useCanvasDrawer(ref, drawGraph, viewport, canvasParams, camera, t);

  const wrapContainer = useDnd(props, imperativeMethods, {
    nodeAtPosition(p) {
      const origin = ref.current.getBoundingClientRect();
      const canvasCoords = { x: p.x - origin.x, y: p.y - origin.y };
      const graphCoords = canvasCoordsToGraphCoords(camera.get(), canvasCoords);
      return tree.nodeAtPoint(graphCoords);
    },
    onNodeMoved({ from, to }) {
      dispatch(store.moveNode({ from, to }));
    }
  });

  return (
    <div>
      {wrapContainer(
        <Canvas
          ref={ref}
          viewport={viewport}
          onContextMenu={cancelContextMenu}
        />
      )}
      <ZoomButtons zoomHandlers={zoomHandlers} />
      <Selection selected={selected} dispatch={dispatch} />
    </div>
  );
});

export default connectDnd(GraphView);
