import { linkVertical } from "d3";
import { getX, getY } from "./treeLayout";

const drawLink = linkVertical()
  .x(getX)
  .y(getY);

const drawPoint = (ctx, d, t, radius = 5) => {
  const x = getX(d, t);
  const y = getY(d, t);
  ctx.moveTo(x + radius, y);
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
};

export default (ctx, { root, selected }, t = 1) => {
  ctx.beginPath();
  drawLink.context(ctx);
  root.links().forEach(d => drawLink(d, t));
  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";
  ctx.stroke();

  ctx.beginPath();
  root.each(d => drawPoint(ctx, d, t));
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.beginPath();
  root
    .descendants()
    .filter(d => d.data.id === selected)
    .forEach(d => drawPoint(ctx, d, t, 8));
  ctx.fillStyle = "rgba(0, 128, 255, 0.8)";
  ctx.fill();
};
