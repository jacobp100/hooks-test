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

export const canvasCoordsToGraphCoords = (canvasOrigin, { x, y }) => {
  return {
    x: (x - canvasOrigin.x) / canvasOrigin.zoom,
    y: (y - canvasOrigin.y) / canvasOrigin.zoom
  };
};
