export const canvasCoordsToGraphCoords = (canvasOrigin, { x, y }) => ({
  x: (x - canvasOrigin.x) / canvasOrigin.zoom,
  y: (y - canvasOrigin.y) / canvasOrigin.zoom
});

export const graphCoordsToCanvasCoords = (canvasOrigin, { x, y }) => ({
  x: x * canvasOrigin.zoom + canvasOrigin.x,
  y: y * canvasOrigin.zoom + canvasOrigin.y
});

export const getCanvasCoordinatesForEvent = e => {
  switch (e.type) {
    case "mouseup":
    case "mousemove":
    case "mousedown":
      return { x: e.offsetX, y: e.offsetY };
    default:
      return null;
  }
};

export const getGraphCoordinatesForEvent = (canvasOrigin, e) => {
  const canvasCoords = getCanvasCoordinatesForEvent(e);
  return canvasCoords != null
    ? canvasCoordsToGraphCoords(canvasOrigin.get(), canvasCoords)
    : null;
};
