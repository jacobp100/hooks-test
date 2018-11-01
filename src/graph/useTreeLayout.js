import { useRef, useMemo, useCallback } from "react";
import { layoutTree } from "./treeLayout";

const applyPreviousCoords = (previous, next) => {
  const findParentInPreviousTree = start => {
    let d = start.parent;
    while (d != null) {
      if (previous.idMap.has(d.data.id)) {
        return d;
      }
      d = d.parent;
    }
    return null;
  };

  const addedNodes = [];
  next.idMap.forEach((d, id) => {
    const previousD = previous.idMap.get(id);
    if (previousD != null) {
      d.xPrev = previousD.x;
      d.yPrev = previousD.y;
      return;
    }

    addedNodes.push(id);

    const prevParent = findParentInPreviousTree(d);
    if (prevParent != null) {
      d.xPrev = prevParent.xPrev;
      d.yPrev = prevParent.yPrev;
    }
  });

  const removedNodes = Array.from(previous.idMap.keys()).filter(
    id => !next.idMap.has(id)
  );

  return { addedNodes, removedNodes };
};

export default nodes => {
  const previousLayoutRef = useRef(null);

  const layout = useMemo(() => layoutTree(nodes), [nodes]);
  const didLayout = layout !== previousLayoutRef.current;

  let addedNodes;
  let removedNodes;
  if (didLayout && previousLayoutRef.current != null) {
    const out = applyPreviousCoords(previousLayoutRef.current, layout);
    addedNodes = out.addedNodes;
    removedNodes = out.removedNodes;
  } else {
    addedNodes = [];
    removedNodes = [];
  }
  previousLayoutRef.current = layout;

  const { root, idMap } = layout;
  const nodeAtPoint = useCallback(
    ({ x, y }) => {
      const node = root
        .descendants()
        .find(d => Math.hypot(d.x - x, d.y - y) <= 5);
      return node != null ? node.data.id : null;
    },
    [layout]
  );

  const nodesInRect = useCallback(
    ({ x0, y0, x1, y1 }) =>
      root
        .descendants()
        .filter(d => d.x >= x0 && d.x <= x1 && d.y >= y0 && d.y <= y1)
        .map(d => d.data.id),
    [layout]
  );

  return { root, idMap, nodeAtPoint, nodesInRect, addedNodes, removedNodes };
};
