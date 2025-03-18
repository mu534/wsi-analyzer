import React, { useState, useEffect, useRef } from "react";
import { useCase } from "../context/CaseContext";

interface ZoomedHubProps {
  region: { x: number; y: number };
}

const ZoomedHub: React.FC<ZoomedHubProps> = ({ region }) => {
  const { caseData } = useCase();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    console.log("ZoomedHub: Attempting to load image from:", caseData.imageSrc);
    img.src = caseData.imageSrc;
    img.onload = () => {
      console.log("ZoomedHub: Image loaded successfully:", {
        width: img.width,
        height: img.height,
      });
      setImage(img);
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      console.error("ZoomedHub: Image failed to load:", caseData.imageSrc);
      setIsLoading(false);
      setHasError(true);
    };
  }, [caseData.imageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to fit the container
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Draw the entire image scaled to fit
    const scale = Math.min(
      canvas.width / image.width,
      canvas.height / image.height
    );
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    ctx.fillStyle = "#fff5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);

    // Draw pointer indicating the viewed region
    const pointerX = offsetX + region.x * scaledWidth;
    const pointerY = offsetY + region.y * scaledHeight;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(pointerX, pointerY, 5, 0, 2 * Math.PI);
    ctx.fill();
  }, [image, region]);

  return (
    <div className="relative w-full h-40 border border-gray-300 rounded bg-white overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600">
          No Image Available (Check path: {caseData.imageSrc})
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ZoomedHub;
