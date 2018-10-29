export const canvasCoordsToGraphCoords = (canvasOrigin, { x, y }) => {
  return {
    x: (x - canvasOrigin.x) / canvasOrigin.zoom,
    y: (y - canvasOrigin.y) / canvasOrigin.zoom
  };
};
