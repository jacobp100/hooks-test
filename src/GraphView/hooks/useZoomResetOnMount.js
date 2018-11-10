import { useMutationEffect } from "react";

export default zoomHandlers => {
  useMutationEffect(() => zoomHandlers.resetZoom({ animated: false }), []);
};
