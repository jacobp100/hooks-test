import { useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { select, event } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";

export default (ref, callbacks) => {
  /*
  See https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
  This is done for correctness, not performance. If we remove zoom events, any
  current zoom interactions will be stopped.
  */
  const callbacksRef = useRef(callbacks);
  useEffect(() => {
    callbacksRef.current = callbacks;
  });

  const selectionRef = useRef(null);
  useLayoutEffect(
    () => {
      selectionRef.current = select(ref.current);
      const z = zoom()
        .filter(() => {
          const { filter } = callbacksRef.current;
          return filter ? filter(event) : true;
        })
        .on("start.zoom", () => {
          const { onStartZoom } = callbacksRef.current;
          if (onStartZoom != null) onStartZoom(event);
        })
        .on("zoom", () => {
          const { onZoom } = callbacksRef.current;
          if (onZoom != null) onZoom(event);
        })
        .on("end.zoom", () => {
          const { onEndZoom } = callbacksRef.current;
          if (onEndZoom != null) onEndZoom(event);
        });
      selectionRef.current.call(z);

      return () => {
        selectionRef.current.on(".zoom", null);
      };
    },
    [ref, selectionRef, callbacksRef]
  );

  const setTransform = useCallback(
    ({ x, y, zoom }) => {
      selectionRef.current.property(
        "__zoom",
        zoomIdentity.translate(x, y).scale(zoom)
      );
    },
    [selectionRef]
  );

  return { setTransform };
};
