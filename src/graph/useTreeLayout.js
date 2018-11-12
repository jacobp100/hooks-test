import { useLayoutEffect, useRef, useMemo, useCallback } from "react";
import { without, filter, intersection } from "lodash/fp";
import { layoutTree } from "./treeLayout";

const parentId = node => (node.parent != null ? node.parent.id : null);

const indexInParent = node =>
  node.parent != null ? node.parent.children.indexOf(node) : 0;

const getChangedNodes = (previous, next) => {
  const nextIds = Array.from(next.idMap.keys());
  const previousIds = Array.from(previous.idMap.keys());

  return {
    addedNodes: without(previousIds, nextIds),
    removedNodes: without(nextIds, previousIds),
    movedNodes: filter(id => {
      const nextNode = next.idMap.get(id);
      const previousNode = previous.idMap.get(id);

      return (
        parentId(nextNode) !== parentId(previousNode) ||
        indexInParent(nextNode) !== indexInParent(previousNode)
      );
    }, intersection(nextIds, previousIds))
  };
};

const noLayoutArgs = { addedNodes: [], removedNodes: [], movedNodes: [] };

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
