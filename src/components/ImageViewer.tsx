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
  }); // Center by default
  const [zoomFactor] = useState(3); // Fixed zoom factor for inset
  const [lastInteractionTime, setLastInteractionTime] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    console.log(
      "ImageViewer: Attempting to load image from:",
      caseData.imageSrc
    );
    img.src = caseData.imageSrc;
    img.onload = () => {
      console.log("ImageViewer: Image loaded successfully:", {
        width: img.width,
        height: img.height,
      });
      setImage(img);
      setHasError(false);
      setIsLoading(false);
      setLastInteractionTime(
        new Date().toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    img.onerror = () => {
      console.error("ImageViewer: Image failed to load:", caseData.imageSrc);
      setHasError(true);
      setIsLoading(false);
    };
  }, [caseData.imageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) {
      console.log("ImageViewer: Canvas or image not available:", {
        canvas,
        image,
      });
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the main image
    ctx.fillStyle = "#fff5f5"; // Light pinkish background to match the image
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    // Draw bounding boxes
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1; // Thin border to match the image
    detectionResults.forEach(([x, y, w, h, label]) => {
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = "white";
      ctx.fillText(label, x, y - 5);
    });
  }, [image, detectionResults]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onRegionChange({ x, y });
    setZoomRegion({ x, y }); // Update zoom region based on mouse position
    setLastInteractionTime(
      new Date().toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  };

  // Memoized drawZoomedInset for performance
  const drawZoomedInset = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      if (!image) return;

      const insetSize = 200;
      const insetX = canvas.width - insetSize - 10;
      const insetY = 10;

      // Draw inset background
      ctx.fillStyle = "white";
      ctx.fillRect(insetX, insetY, insetSize, insetSize);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.strokeRect(insetX, insetY, insetSize, insetSize);

      // Calculate the zoomed region
      const zoomX = zoomRegion.x * image.width - insetSize / zoomFactor / 2;
      const zoomY = zoomRegion.y * image.height - insetSize / zoomFactor / 2;
      const zoomedWidth = image.width / zoomFactor;
      const zoomedHeight = image.height / zoomFactor;

      // Draw the zoomed portion
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

      // Draw bounding boxes in the zoomed inset
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
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
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
          Loading Image...
        </div>
      )}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
          No Image Available (Check path: {caseData.imageSrc})
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className="w-full h-full cursor-crosshair"
        style={{
          backgroundColor: "#2d3748",
          display: hasError || isLoading ? "none" : "block",
        }}
      />
      <div className="absolute bottom-2 left-2 text-white text-sm">
        Last Interaction: {lastInteractionTime}
      </div>
    </div>
  );
};

export default ImageViewer;
