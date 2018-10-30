import { stratify, tree } from "d3";

const createRoot = stratify();

const layout = tree().nodeSize([5, 5]);

const scaleX = 3;
const scaleY = 5;
export const layoutTree = nodes =>
  layout(createRoot(nodes)).each(d => {
    d.x *= scaleX;
    d.y *= scaleY;
    d.xPrev = d.x;
    d.yPrev = d.y;
  });

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
