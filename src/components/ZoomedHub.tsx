import React, { useState, useEffect } from "react";
import { useCase } from "../context/CaseContext";

interface ZoomedHubProps {
  region: { x: number; y: number };
}

const ZoomedHub: React.FC<ZoomedHubProps> = ({ region }) => {
  const { caseData } = useCase();
  const [zoomedImageStyle, setZoomedImageStyle] = useState({});

  useEffect(() => {
    const zoomFactor = 4;
    const offsetX = -(region.x * 100 * zoomFactor - 50);
    const offsetY = -(region.y * 100 * zoomFactor - 50);
    setZoomedImageStyle({
      transform: `scale(${zoomFactor})`,
      transformOrigin: "top left",
      position: "absolute",
      left: `${offsetX}%`,
      top: `${offsetY}%`,
    });
  }, [region]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
        WSI Zoomed Out View (HUB)
      </h3>
      <div className="w-full h-32 relative border border-gray-300 dark:border-gray-600">
        <img
          src={caseData.imageSrc}
          alt="Zoomed Hub View"
          className="w-full h-full object-contain"
          style={zoomedImageStyle}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        <strong>Patient ID:</strong> {caseData.patientId} |{" "}
        <strong>Sample:</strong> {caseData.sampleType}
      </div>
    </div>
  );
};

export default ZoomedHub;
