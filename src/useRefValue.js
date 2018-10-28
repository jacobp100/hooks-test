import { useRef } from "react";

export default value => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
