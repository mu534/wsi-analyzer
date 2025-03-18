import React, { useState, useEffect } from "react";
import { CaseProvider, useCase } from "./context/CaseContext";
import ImageViewer from "./components/ImageViewer";
import Sidebar from "./components/Sidebar";
import ZoomedHub from "./components/ZoomedHub";

const App: React.FC = () => {
  const { caseData } = useCase();
  const [region, setRegion] = useState({ x: 0.5, y: 0.5 });
  const [detectionResults, setDetectionResults] = useState<
    [number, number, number, number, string][]
  >([]);

  useEffect(() => {
    setDetectionResults(caseData.detectionResults);
  }, [caseData.detectionResults]);

  // Format timestamp to match wireframe
  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button className="p-2 bg-gray-200 rounded">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-lg font-semibold text-gray-700">
            {timestamp}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 space-x-4">
        {/* Left: Sidebar */}
        <div className="w-1/4">
          <Sidebar />
        </div>

        {/* Right: WSI Viewer and Hub */}
        <div className="w-3/4 flex flex-col space-y-4">
          {/* Top: Hub View */}
          <div className="flex justify-between items-center bg-gray-200 p-2 rounded">
            <div className="flex space-x-2">
              <span>WSI Zoomed out View (Hub)</span>
              <span>Patient ID: {caseData.patientId}</span>
              <span>{caseData.sampleType}</span>
            </div>
            <div className="w-1/3">
              <ZoomedHub region={region} />
            </div>
          </div>

          {/* Center: WSI Viewer */}
          <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden relative">
            <ImageViewer
              onRegionChange={setRegion}
              detectionResults={detectionResults}
            />
            <div className="absolute top-2 left-2 text-white">
              WSI Zoomed IN View
            </div>
          </div>

          {/* Bottom Right: Report Button */}
          <div className="flex justify-end">
            <button className="bg-blue-500 text-white p-2 rounded">
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default () => (
  <CaseProvider>
    <App />
  </CaseProvider>
);
