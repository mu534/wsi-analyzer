import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCase } from "../context/CaseContext";

interface ImageViewerProps {
  onRegionChange: (region: { x: number; y: number }) => void;
  detectionResults: [number, number, number, number, string][];
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  onRegionChange,
  detectionResults,
}) => {
  const { caseData } = useCase();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomRegion, setZoomRegion] = useState<{ x: number; y: number }>({
    x: 0.5,
    y: 0.5,
  });
  const [zoomFactor] = useState(3);
  const [lastInteractionTime, setLastInteractionTime] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.src = caseData.imageSrc;
    img.onload = () => {
      setImage(img);
      setHasError(false);
      setIsLoading(false);
      setLastInteractionTime(new Date().toLocaleString());
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
  }, [caseData.imageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.fillStyle = "#1a202c"; // Dark blue-gray background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    ctx.strokeStyle = "#00ffcc"; // Cyan for better visibility
    ctx.lineWidth = 1.5;
    detectionResults.forEach(([x, y, w, h, label]) => {
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = "white";
      ctx.fillText(label, x + 5, y - 5);
    });
  }, [image, detectionResults]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onRegionChange({ x, y });
    setZoomRegion({ x, y });
    setLastInteractionTime(new Date().toLocaleTimeString());
  };

  const drawZoomedInset = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      if (!image) return;

      const insetSize = 220;
      const insetX = canvas.width - insetSize - 15;
      const insetY = 15;

      ctx.fillStyle = "#121826"; // Deep dark inset background
      ctx.fillRect(insetX, insetY, insetSize, insetSize);
      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(insetX, insetY, insetSize, insetSize);

      const zoomX = zoomRegion.x * image.width - insetSize / zoomFactor / 2;
      const zoomY = zoomRegion.y * image.height - insetSize / zoomFactor / 2;
      const zoomedWidth = image.width / zoomFactor;
      const zoomedHeight = image.height / zoomFactor;

      ctx.drawImage(
        image,
        zoomX,
        zoomY,
        zoomedWidth,
        zoomedHeight,
        insetX,
        insetY,
        insetSize,
        insetSize
      );

      ctx.strokeStyle = "#ffcc00"; // Yellow bounding boxes in zoomed view
      ctx.lineWidth = 1.2;
      detectionResults.forEach(([x, y, w, h]) => {
        const scaledX = (x - zoomX) * (insetSize / zoomedWidth) + insetX;
        const scaledY = (y - zoomY) * (insetSize / zoomedHeight) + insetY;
        const scaledW = (w * insetSize) / zoomedWidth;
        const scaledH = (h * insetSize) / zoomedHeight;
        if (
          scaledX >= insetX &&
          scaledY >= insetY &&
          scaledX + scaledW <= insetX + insetSize &&
          scaledY + scaledH <= insetY + insetSize
        ) {
          ctx.strokeRect(scaledX, scaledY, scaledW, scaledH);
        }
      });
    },
    [image, zoomRegion, zoomFactor, detectionResults]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawZoomedInset(ctx, canvas);
  }, [drawZoomedInset, image, detectionResults]);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white text-lg font-semibold animate-pulse">
          Loading Image...
        </div>
      )}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-800 text-white text-lg font-semibold rounded-md shadow-md">
          ❌ No Image Available (Check path: {caseData.imageSrc})
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className="w-full h-full cursor-crosshair"
        style={{
          backgroundColor: "#1a202c",
          display: hasError || isLoading ? "none" : "block",
        }}
      />
      <div className="absolute bottom-2 left-2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-md">
        ⏳ Last Interaction: {lastInteractionTime}
      </div>
    </div>
  );
};

export default ImageViewer;
