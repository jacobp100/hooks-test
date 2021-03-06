import React, { forwardRef } from "react";

export default forwardRef(({ viewport, ...props }, ref) => {
  const { width, height, scale } = viewport;
  return (
    <canvas
      ref={ref}
      style={{ display: "block", width, height }}
      width={width * scale}
      height={height * scale}
      {...props}
    />
  );
});
