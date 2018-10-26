export default (width, height, scale, coordinates) => {
  const current = coordinates.get();
  const x = (current.x - width / 2) * scale + width / 2;
  const y = (current.y - width / 2) * scale + width / 2;
  const zoom = current.zoom * scale;
  return { x, y, zoom };
};
