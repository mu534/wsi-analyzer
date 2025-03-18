import React, { useState, useEffect, useRef } from "react";
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

    // Set canvas size to match container
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Calculate scale to fit the image within the canvas
    const scale = Math.min(
      canvas.width / image.width,
      canvas.height / image.height
    );
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    // Draw the main image
    ctx.fillStyle = "#fff5f5"; // Light pinkish background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);

    // Draw bounding boxes, scaled appropriately
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 0.5; // Thinner line to avoid "bulky" appearance
    detectionResults.forEach(([x, y, w, h, label]) => {
      const scaledX = offsetX + x * scale;
      const scaledY = offsetY + y * scale;
      const scaledW = w * scale;
      const scaledH = h * scale;
      ctx.strokeRect(scaledX, scaledY, scaledW, scaledH);
      ctx.fillStyle = "white";
      ctx.font = "10px Arial"; // Fixed font size for readability
      ctx.fillText(label, scaledX, scaledY - 5);
    });
  }, [image, detectionResults]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onRegionChange({ x, y });
    setZoomRegion({ x, y });
  };

  const drawZoomedInset = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    if (!image) return;

    const insetSize = 150;
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
    ctx.lineWidth = 0.5;
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
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawZoomedInset(ctx, canvas);
  }, [zoomRegion, image, detectionResults]);

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
    </div>
  );
};

export default ImageViewer;
