import { useState } from "react";

const useImageZoom = (initialZoom: number = 1.0) => {
  const [zoom, setZoom] = useState(initialZoom);
  const handleZoomIn = () => setZoom(zoom + 0.1);
  return { zoom, handleZoomIn };
};

export default useImageZoom;
