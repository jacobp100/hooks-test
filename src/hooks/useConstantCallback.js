import { useCallback, useRef, useMutationEffect } from "react";

// Makes a callback have a constant identity
export default baseCallback => {
  const callbackRef = useRef(baseCallback);

  useMutationEffect(() => {
    callbackRef.current = baseCallback;
  });

  return useCallback(arg => callbackRef.current(arg), [callbackRef]);
};
