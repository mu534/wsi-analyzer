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
  const [isReferencesVisible, setIsReferencesVisible] = useState(false);

  useEffect(() => {
    setDetectionResults(caseData.detectionResults);
  }, [caseData.detectionResults]);

  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleDownloadReport = () => {
    const data = `Patient ID: ${caseData.patientId}\nSample Type: ${
      caseData.sampleType
    }\nRBC Data: ${JSON.stringify(
      caseData.rbcData
    )}\nWBC Data: ${JSON.stringify(
      caseData.wbcData
    )}\nPlatelets: ${JSON.stringify(caseData.platelets)}`;
    const blob = new Blob([data], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${caseData.patientId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
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
        <button
          onClick={() => setIsReferencesVisible(!isReferencesVisible)}
          className="bg-blue-200 p-2 rounded text-sm"
          title="Show References"
        >
          References
        </button>
      </div>

      {/* Main Content */}
      <div className="flex space-x-4">
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
            <button
              onClick={handleDownloadReport}
              className="bg-blue-500 text-white p-2 rounded"
              title="Download Report"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* References Modal */}
      {isReferencesVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg max-w-md">
            <h3 className="text-lg font-bold mb-2">References</h3>
            <ul className="list-disc pl-5">
              <li>
                <a
                  href="https://dicom.nema.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DICOM Standard
                </a>{" "}
                - For medical imaging protocols.
              </li>
              <li>
                <a
                  href="https://openslide.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenSlide
                </a>{" "}
                - Open-source WSI viewer library.
              </li>
              <li>
                <a
                  href="https://qupath.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  QuPath
                </a>{" "}
                - Open-source software for bioimage analysis.
              </li>
            </ul>
            <button
              onClick={() => setIsReferencesVisible(false)}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default () => (
  <CaseProvider>
    <App />
  </CaseProvider>
);
