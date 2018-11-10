import { stratify, tree } from "d3";

const createRoot = stratify();

const layout = tree().nodeSize([5, 5]);

export const applyPreviousCoords = (previous, next) => {
  next.idMap.forEach(d => {
    const closestPreviousId = d
      .ancestors()
      .map(other => other.data.id)
      .find(otherId => previous.idMap.has(otherId));

    if (closestPreviousId != null) {
      const closestPreviousNode = previous.idMap.get(closestPreviousId);
      d.xPrev = closestPreviousNode.x;
      d.yPrev = closestPreviousNode.y;
    }
  });
};

const scaleX = 3;
const scaleY = 5;
export const layoutTree = (nodes, previous) => {
  const idMap = new Map();
  const root = layout(createRoot(nodes)).each(d => {
    idMap.set(d.data.id, d);
    d.x *= scaleX;
    d.y *= scaleY;
    d.xPrev = d.x;
    d.yPrev = d.y;
  });

  const next = { root, idMap };

  if (previous != null) {
    applyPreviousCoords(previous, next);
  }

  return next;
};

export const treeBounds = root => {
  let x0 = 0;
  let y0 = 0;
  let x1 = 0;
  let y1 = 0;

  root.each(({ x, y }) => {
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
  });

  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
};

export const getX = (d, t) => d.x + (d.xPrev - d.x) * (1 - t);
export const getY = (d, t) => d.y + (d.yPrev - d.y) * (1 - t);
