import { useCallback } from "react";

export default (ref, draw, params) => {
  const render = useCallback(
    coords => {
      draw(ref.current.getContext("2d"), params, coords);
    },
    [params]
  );

  return render;
};
