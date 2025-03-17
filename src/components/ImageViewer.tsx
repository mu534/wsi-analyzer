import React, { useState } from "react";
import useImageZoom from "../hooks/useImageZoom";
import { useCase } from "../context/CaseContext";

interface ImageViewerProps {
  onRegionChange?: (region: { x: number; y: number }) => void;
  detectionResults: any[];
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  onRegionChange,
  detectionResults,
}) => {
  const { caseData } = useCase();
  const { zoom } = useImageZoom(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPointerPosition({ x, y });
    if (onRegionChange) onRegionChange({ x, y });

    if (isDragging) {
      const dx = (e.clientX - dragStart.x) / zoom;
      const dy = (e.clientY - dragStart.y) / zoom;
      setPosition((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(e.target.value));
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={caseData.imageSrc}
        alt="Whole Slide Image"
        className="w-full h-full object-contain"
        style={{
          transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? "none" : "transform 0.2s",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      />
      {/* Pointer Indicator */}
      <div
        className="absolute w-4 h-4 bg-red-500 rounded-full opacity-50"
        style={{
          left: `${pointerPosition.x * 100}%`,
          top: `${pointerPosition.y * 100}%`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
      {/* Bounding Boxes */}
      {showAnnotations &&
        detectionResults.map((result, index) => (
          <div
            key={index}
            className="absolute border-2 border-yellow-500"
            style={{
              left: result.x / zoom - position.x,
              top: result.y / zoom - position.y,
              width: result.width / zoom,
              height: result.height / zoom,
              pointerEvents: "none",
            }}
          >
            <span className="text-yellow-500 text-xs">{result.label}</span>
          </div>
        ))}
      {/* Controls */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={zoom}
          onChange={handleZoomChange}
          className="w-32"
        />
        <button
          onClick={() => setShowAnnotations(!showAnnotations)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showAnnotations ? "Hide Annotations" : "Show Annotations"}
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
