import { useRef, useEffect, useCallback } from "react";
import { selection, event } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";

export default (ref, updater) => {
  const selectionRef = useRef(null);
  const zoomRef = useRef(null);

  useEffect(() => {
    selectionRef.current = selection(ref.current);
    zoomRef.current = zoom().on("zoom", () => {
      const { x, y, k } = event.transform;
      updater({ x, y, zoom: k });
    });
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
