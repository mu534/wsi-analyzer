import React, { useState, useEffect } from "react";
import { CaseProvider, useCase } from "./context/CaseContext";
import ImageViewer from "./components/ImageViewer";
import Sidebar from "./components/Sidebar";
import ZoomedHub from "./components/ZoomedHub";
import SummaryPanel from "./components/SummaryPanel";

const App: React.FC = () => {
  const { caseData, detectionResults } = useCase();
  const [region, setRegion] = useState({ x: 0.5, y: 0.5 });
  const [localDetectionResults, setLocalDetectionResults] = useState<
    [number, number, number, number, string][]
  >([]);
  const [isReferencesVisible, setIsReferencesVisible] = useState(false);

  useEffect(() => {
    setLocalDetectionResults(detectionResults);
  }, [detectionResults]);

  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleDownloadReport = (format: string) => {
    const data = `Patient ID: ${caseData.patientId}\nSample Type: ${
      caseData.sampleType
    }\nRBC Data: ${JSON.stringify(
      caseData.rbcData,
      null,
      2
    )}\nWBC Data: ${JSON.stringify(
      caseData.wbcData,
      null,
      2
    )}\nPlatelets: ${JSON.stringify(caseData.platelets, null, 2)}`;
    const blob = new Blob([data], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${caseData.patientId}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 bg-white p-4 rounded-xl shadow-sm">
        {/* Timestamp & Back Button */}
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-transform transform hover:scale-105">
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

        {/* References Button */}
        <button
          onClick={() => setIsReferencesVisible(!isReferencesVisible)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition-transform transform hover:scale-105"
          title="Show References"
        >
          📚 References
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 flex flex-col space-y-4 sm:space-y-6">
          {/* Top Section: Summary & Zoomed View */}
          <div className="flex flex-col md:flex-row items-center bg-white p-4 sm:p-6 rounded-xl shadow-sm space-y-4 md:space-y-0 md:space-x-6">
            <SummaryPanel />
            <div className="w-full md:w-1/3">
              <ZoomedHub region={region} />
            </div>
          </div>

          {/* WSI Viewer */}
          <div className="relative bg-white-900 rounded-xl overflow-hidden shadow-sm">
            <ImageViewer
              onRegionChange={setRegion}
              detectionResults={localDetectionResults}
            />
            <div className="absolute top-2 left-2 text-white font-semibold bg-gray-800 px-3 py-1 rounded-lg">
              🔬 WSI Zoomed IN View
            </div>
          </div>
          {/* Report Download Button */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-4">
              <button
                onClick={() => handleDownloadReport("txt")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                title="Download Report as TXT"
              >
                <span className="font-medium">📄 TXT</span>
              </button>
              <button
                onClick={() => handleDownloadReport("json")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                title="Download Report as JSON"
              >
                <span className="font-medium">🧾 JSON</span>
              </button>
              <button
                onClick={() => handleDownloadReport("csv")}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                title="Download Report as CSV"
              >
                <span className="font-medium">📊 CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* References Modal */}
      {isReferencesVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              📚 References
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                <a
                  href="https://dicom.nema.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
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
                  className="text-blue-600 hover:underline"
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
                  className="text-blue-600 hover:underline"
                >
                  QuPath
                </a>{" "}
                - Open-source software for bioimage analysis.
              </li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsReferencesVisible(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-transform transform hover:scale-105"
              >
                ❌ Close
              </button>
            </div>
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
