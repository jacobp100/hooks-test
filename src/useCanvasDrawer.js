import { useCallback } from "react";

const resetCanvas = (ctx, { width, height, scale }, { x, y, zoom }) => {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.setTransform(zoom * scale, 0, 0, zoom * scale, x * scale, y * scale);
};

export default (ref, draw, viewport, params) => {
  const render = useCallback(
    coords => {
      const ctx = ref.current.getContext("2d");
      resetCanvas(ctx, viewport, coords);
      draw(ctx, params);
    },
    [viewport, params]
  );

  return render;
};
