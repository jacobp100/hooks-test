import { useEffect } from "react";

export default zoomHandlers => {
  useEffect(() => zoomHandlers.resetZoom({ animated: false }), []);
};
