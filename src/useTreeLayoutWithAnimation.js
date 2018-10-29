import { useMemo } from "react";
import useTreeLayout from "./useTreeLayout";

import { tween, value } from "popmotion";

const createT = () => value(1);

export default nodes => {
  const { root, nodeAtPoint, didLayout } = useTreeLayout(nodes);

  const t = useMemo(createT);
  if (didLayout) tween({ from: 0, to: 1 }).start(t);

  return { root, nodeAtPoint, t };
};
