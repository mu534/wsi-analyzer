import { useState } from "react";

const useImageZoom = (
  initialZoom: number = 1.0,
  zoomStep: number = 0.1,
  minZoom: number = 1.0,
  maxZoom: number = 5.0
) => {
  const [zoom, setZoom] = useState(initialZoom);

  const handleZoomIn = () =>
    setZoom((prevZoom) => Math.min(maxZoom, prevZoom + zoomStep));
  const handleZoomOut = () =>
    setZoom((prevZoom) => Math.max(minZoom, prevZoom - zoomStep));
  const resetZoom = () => setZoom(initialZoom);

  return { zoom, setZoom, handleZoomIn, handleZoomOut, resetZoom };
};

export default useImageZoom;
