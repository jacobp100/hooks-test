import { useMemo, useCallback } from "react";
import { useValueOutput } from "../../animation/usePopmotionOutput";
import mergeValues from "../../animation/mergeValues";

const resetCanvas = (ctx, { width, height, scale }, { x, y, zoom }) => {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.setTransform(zoom * scale, 0, 0, zoom * scale, x * scale, y * scale);
};

export default (ref, draw, viewport, params, canvasOrigin, t) => {
  const render = useCallback(
    ([canvasOriginValue, tValue]) => {
      const ctx = ref.current.getContext("2d");
      resetCanvas(ctx, viewport, canvasOriginValue);
      draw(ctx, params, tValue);
      if (params.selectionRectangle) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        const { x, y, width, height } = params.selectionRectangle;
        ctx.fillRect(x, y, width, height);
      }
    },
    [ref, draw, viewport, params]
  );

  const mergedValues = useMemo(() => mergeValues(canvasOrigin, t), [
    canvasOrigin,
    t
  ]);
  useValueOutput(mergedValues, render);
};
