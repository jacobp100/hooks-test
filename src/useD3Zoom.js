import { useRef, useEffect, useCallback } from "react";
import { select, event } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";

export default (ref, callbacks) => {
  /*
  Allow us to use the same event handlers for d3.zoom, even if the callbacks
  change. This is actually a correctness issue rather than performance: if the
  user is zooming when the callbacks changed, we would have removed the zoom
  handlers. That is not what we would want.

  This behaviour is also similar to how React Native internally handles events.
  All events like `onPress` are actually instance properties (usually in the
  form _onPress) that check if there is the equivalent callback in the prop,
  and then calls it. The instance properties are then passed to the native code
  component rather than the callback in the props.
  */
  const callbacksRef = useRef(null);
  callbacksRef.current = callbacks;

  const selectionRef = useRef(null);

  useEffect(
    () => {
      selectionRef.current = select(ref.current);
      const z = zoom()
        .on("start.zoom", () => {
          const { onStartZoom } = callbacksRef.current;
          if (onStartZoom != null) onStartZoom();
        })
        .on("zoom", () => {
          const { onZoom } = callbacksRef.current;
          if (onZoom != null) {
            const { x, y, k } = event.transform;
            onZoom({ x, y, zoom: k });
          }
        })
        .on("end.zoom", () => {
          const { onEndZoom } = callbacksRef.current;
          if (onEndZoom != null) onEndZoom();
        });
      selectionRef.current.call(z);

      return () => {
        selectionRef.current.on(".zoom", null);
      };
    },
    [ref, selectionRef, callbacksRef]
  );

  const setZoom = useCallback(
    ({ x, y, zoom }) => {
      selectionRef.current.property(
        "__zoom",
        zoomIdentity.translate(x, y).scale(zoom)
      );
    },
    [selectionRef]
  );

  return setZoom;
};
