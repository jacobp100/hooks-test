import { useCallback } from "react";

const clearCanvas = (ctx, { width, height, scale }, { x, y, zoom }) => {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.setTransform(zoom * scale, 0, 0, zoom * scale, x * scale, y * scale);
};

export default (ref, draw, params) => {
  const render = useCallback(
    coords => {
      const ctx = ref.current.getContext("2d");
      clearCanvas(ctx, params, coords);
      draw(ctx, params);
    },
    [params]
  );

  return render;
};
