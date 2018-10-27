import { useRef, useEffect, useCallback } from "react";
import { select, event } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";

const noop = () => {};

export default (
  ref,
  { onStartZoom = noop, onZoom = noop, onEndZoom = noop }
) => {
  const selectionRef = useRef(null);
  const zoomRef = useRef(null);

  useEffect(() => {
    selectionRef.current = select(ref.current);
    zoomRef.current = zoom()
      .on("start.zoom", onStartZoom)
      .on("zoom", () => {
        const { x, y, k } = event.transform;
        onZoom({ x, y, zoom: k });
      })
      .on("end.zoom", onEndZoom);
    selectionRef.current.call(zoomRef.current);

    return () => {
      selectionRef.current.on(".zoom", null);
    };
  }, []);

  const setZoom = useCallback(({ x, y, zoom }) => {
    selectionRef.current.property(
      "__zoom",
      zoomIdentity.translate(x, y).scale(zoom)
    );
  }, []);

  return setZoom;
};
