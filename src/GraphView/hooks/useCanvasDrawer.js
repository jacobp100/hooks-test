import { useEffect, useMemo, useCallback } from "react";
import useRefValue from "../../hooks/useRefValue";
import { useValueOutput } from "../../animation/usePopmotionOutput";
import mergeValues from "../../animation/mergeValues";

const resetCanvas = (ctx, { width, height, scale }, { x, y, zoom }) => {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.setTransform(zoom * scale, 0, 0, zoom * scale, x * scale, y * scale);
};

export default (ref, draw, viewport, params, canvasOrigin, t) => {
  const viewportRef = useRefValue(viewport);
  const paramsRef = useRefValue(params);

  const render = useCallback(
    ([canvasOriginValue, tValue]) => {
      const ctx = ref.current.getContext("2d");
      resetCanvas(ctx, viewportRef.current, canvasOriginValue);
      draw(ctx, paramsRef.current, tValue);
    },
    [viewportRef, paramsRef]
  );

  const mergedValues = useMemo(() => mergeValues(canvasOrigin, t), [
    canvasOrigin,
    t
  ]);
  useValueOutput(mergedValues, render);

  useEffect(() => {
    render([canvasOrigin.get(), t.get()]);
  });
};
