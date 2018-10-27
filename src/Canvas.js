import React, { forwardRef } from "react";

export default forwardRef(({ viewport }, ref) => (
  <canvas
    ref={ref}
    style={{
      display: "block",
      width: viewport.width,
      height: viewport.height
    }}
    width={viewport.width * viewport.scale}
    height={viewport.height * viewport.scale}
  />
));
