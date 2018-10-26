import { range } from "d3";

export default (ctx, { x, y, zoom }, { width, height, scale = 1 }) => {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.setTransform(zoom * scale, 0, 0, zoom * scale, x * scale, y * scale);
  ctx.fillStyle = "black";
  drawPoints(ctx);
};

const radius = 2.5;
const width = 500;
const height = 500;
const points = range(2000).map(phyllotaxis(10));

function drawPoints(ctx) {
  ctx.beginPath();
  points.forEach(point => drawPoint(ctx, point));
  ctx.fill();
}

function drawPoint(ctx, point) {
  ctx.moveTo(point[0] + radius, point[1]);
  ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
}

function phyllotaxis(radius) {
  var theta = Math.PI * (3 - Math.sqrt(5));
  return function(i) {
    var r = radius * Math.sqrt(i),
      a = theta * i;
    return [width / 2 + r * Math.cos(a), height / 2 + r * Math.sin(a)];
  };
}
