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
    img.src = caseData.imageSrc;
    img.onload = () => {
      setImage(img);
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
  }, [caseData.imageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    const scale = Math.min(
      canvas.width / image.width,
      canvas.height / image.height
    );
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    // Background fill for better contrast
    ctx.fillStyle = "#1a202c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);

    // Draw zoomed region indicator
    const roiSize = 50 * scale;
    const roiX = offsetX + region.x * (image.width * scale - roiSize);
    const roiY = offsetY + region.y * (image.height * scale - roiSize);
    ctx.strokeStyle = "#ffcc00"; // Yellow highlight for better visibility
    ctx.lineWidth = 2;
    ctx.strokeRect(roiX, roiY, roiSize, roiSize);
  }, [image, region]);

  return (
    <div className="relative w-full h-56 border border-gray-400 rounded-xl bg-gray-900 shadow-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
          <svg
            className="animate-spin h-10 w-10 text-blue-400"
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
        <div className="absolute inset-0 flex items-center justify-center bg-red-700 text-white text-lg font-semibold">
          ❌ No Image Available <br />
          <span className="text-sm">Check path: {caseData.imageSrc}</span>
        </div>
      )}
      {!isLoading && !hasError && (
        <div className="flex flex-col h-full">
          <div className="text-center p-3 bg-gray-800 text-white font-semibold">
            🔍 WSI Zoomed View (Hub)
          </div>
          <canvas ref={canvasRef} className="flex-1 w-full" />
          <div className="flex justify-between p-3 bg-gray-800 text-white border-t border-gray-700"></div>
        </div>
      )}
    </div>
  );
};

export default ZoomedHub;
