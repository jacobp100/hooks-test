import { useRef } from "react";
import { value } from "popmotion";

export default (updater, initialValues) => {
  const val = useRef(null);

  if (val.current === null) {
    val.current = value(initialValues);
  }

  return val;
};
