import useGlobalKeyboardShortcut from "./useGlobalKeyboardShortcut";

export default zoomHandlers => {
  useGlobalKeyboardShortcut("=", zoomHandlers.zoomIn);
  useGlobalKeyboardShortcut("-", zoomHandlers.zoomOut);
  useGlobalKeyboardShortcut("0", zoomHandlers.resetZoom);
};
