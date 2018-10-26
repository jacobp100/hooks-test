import { useCallback } from "react";

export default (ref, draw, params) => {
  return useCallback(
    coords => draw(ref.current.getContext("2d"), coords, params),
    []
  );
};
