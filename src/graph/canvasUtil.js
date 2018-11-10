export const canvasCoordsToGraphCoords = (camera, { x, y }) => ({
  x: (x - camera.x) / camera.zoom,
  y: (y - camera.y) / camera.zoom
});

export const graphCoordsToCanvasCoords = (camera, { x, y }) => ({
  x: x * camera.zoom + camera.x,
  y: y * camera.zoom + camera.y
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

export const getGraphCoordinatesForEvent = (camera, e) => {
  const canvasCoords = getCanvasCoordinatesForEvent(e);
  return canvasCoords != null
    ? canvasCoordsToGraphCoords(camera.get(), canvasCoords)
    : null;
};
