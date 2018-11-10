import React from "react";
import Button from "../Button";

export default ({ zoomHandlers }) => (
  <>
    <Button onClick={zoomHandlers.zoomIn} title="Zoom In" />
    <Button onClick={zoomHandlers.zoomOut} title="Zoom Out" />
    <Button onClick={zoomHandlers.resetZoom} title="Zoom to Fit" />
  </>
);
