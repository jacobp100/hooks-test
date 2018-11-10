export default (additive, start, end) =>
  start != null && end != null
    ? {
        additive,
        x0: Math.min(start.x, end.x),
        y0: Math.min(start.y, end.y),
        x1: Math.max(start.x, end.x),
        y1: Math.max(start.y, end.y)
      }
    : null;
