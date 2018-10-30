import { useRef, useMemo, useCallback } from "react";
import { layoutTree } from "./treeLayout";

const applyPreviousCoords = (previous, next) => {
  const idMap = new Map();
  previous.each(d => {
    idMap.set(d.data.id, d);
  });

  const findParentInPreviousTree = start => {
    let d = start;
    while (d != null) {
      d = d.parent;
      if (d != null && idMap.has(d.data.id)) {
        return d;
      }
    }
    return null;
  };

  next.each(d => {
    const previousD = idMap.get(d.data.id);
    if (previousD != null) {
      d.xPrev = previousD.x;
      d.yPrev = previousD.y;
      return;
    }

    const prevParent = findParentInPreviousTree(d);
    if (prevParent != null) {
      d.xPrev = prevParent.x;
      d.yPrev = prevParent.y;
    }
  });
};

export default nodes => {
  const previousRef = useRef(null);

  const root = useMemo(() => layoutTree(nodes), [nodes]);
  const didLayout = root !== previousRef.current;

  if (didLayout && previousRef.current != null) {
    applyPreviousCoords(previousRef.current, root);
  }
  previousRef.current = root;

  const nodeAtPoint = useCallback(
    ({ x, y }) => {
      const node = root
        .descendants()
        .find(d => Math.hypot(d.x - x, d.y - y) <= 5);
      return node != null ? node.data.id : null;
    },
    [root]
  );

  return { root, nodeAtPoint, didLayout };
};
