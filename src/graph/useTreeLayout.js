import { useLayoutEffect, useRef, useMemo, useCallback } from "react";
import { layoutTree } from "./treeLayout";

const getChangedNodes = (previous, next) => ({
  addedNodes: Array.from(next.idMap.keys()).filter(
    id => !previous.idMap.has(id)
  ),
  removedNodes: Array.from(previous.idMap.keys()).filter(
    id => !next.idMap.has(id)
  )
});

const noLayoutArgs = { addedNodes: [], removedNodes: [] };

export default (nodes, { onLayout } = {}) => {
  const previousLayoutRef = useRef(null);
  const previous = previousLayoutRef.current;
  const layout = useMemo(() => layoutTree(nodes, previous), [nodes]);
  const didLayout = layout !== previous;

  useLayoutEffect(() => {
    previousLayoutRef.current = layout;

    if (didLayout) {
      let args =
        previous != null ? getChangedNodes(previous, layout) : noLayoutArgs;

      if (typeof onLayout === "function") {
        onLayout(args);
      }
    }
  });

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

  return { root, idMap, nodeAtPoint, nodesInRect };
};
