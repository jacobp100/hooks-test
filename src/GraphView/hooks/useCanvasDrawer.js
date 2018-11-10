import { useMemo, useCallback } from "react";
import { useActionOutput } from "../../animation/usePopmotionOutput";
import mergeValues from "../../animation/mergeValues";

const resetCanvas = (ctx, { width, height, scale }, { x, y, zoom }) => {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.setTransform(zoom * scale, 0, 0, zoom * scale, x * scale, y * scale);
};

export default (ref, draw, viewport, params, camera, t) => {
  const render = useCallback(
    ([cameraValue, tValue]) => {
      const ctx = ref.current.getContext("2d");
      resetCanvas(ctx, viewport, cameraValue);
      draw(ctx, params, tValue);
      if (params.selectionRectangle) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        const { x0, y0, x1, y1 } = params.selectionRectangle;
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      }
    },
    [ref, draw, viewport, params]
  );

  const mergedValues = useMemo(() => mergeValues(camera, t), [camera, t]);
  useActionOutput(mergedValues, render);
};
