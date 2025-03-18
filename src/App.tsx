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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-100 p-4 sm:p-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <button className="p-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full hover:from-gray-300 hover:to-gray-400 transition-all duration-200 transform hover:scale-110">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            {timestamp}
          </span>
        </div>
        <button
          onClick={() => setIsReferencesVisible(!isReferencesVisible)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-110 flex items-center space-x-2"
        >
          <span>📚</span>
          <span className="font-semibold">References</span>
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 transition-all duration-300">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 flex flex-col space-y-6">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-6 md:space-y-0 md:space-x-6 transition-all duration-300">
            <SummaryPanel />
            <div className="w-full md:w-1/3">
              <ZoomedHub region={region} />
            </div>
          </div>

          {/* WSI Viewer */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 transition-all duration-300">
            <ImageViewer
              onRegionChange={setRegion}
              detectionResults={localDetectionResults}
            />
            <div className="absolute top-3 left-3 text-white font-medium bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-1.5 rounded-full flex items-center space-x-2">
              <span>🔬</span>
              <span>WSI Zoomed View</span>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex justify-center mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { format: "txt", color: "green", icon: "📄" },
                { format: "json", color: "blue", icon: "🧾" },
                { format: "csv", color: "yellow", icon: "📊" },
              ].map(({ format, color, icon }) => (
                <button
                  key={format}
                  onClick={() => handleDownloadReport(format)}
                  className={`bg-${color}-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-${color}-700 focus:ring-2 focus:ring-${color}-500 transition-all duration-200 transform hover:scale-110 hover:-translate-y-1 flex items-center space-x-2`}
                >
                  <span>{icon}</span>
                  <span className="font-medium uppercase">{format}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* References Modal */}
      {isReferencesVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full mx-4 border border-gray-200 transform scale-100 transition-all duration-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center space-x-2">
              <span>📚</span>
              <span>References</span>
            </h3>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              {[
                { href: "https://dicom.nema.org/", text: "DICOM Standard" },
                { href: "https://openslide.org/", text: "OpenSlide" },
                { href: "https://qupath.github.io/", text: "QuPath" },
              ].map((ref) => (
                <li key={ref.href}>
                  <a
                    href={ref.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
                  >
                    {ref.text}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsReferencesVisible(false)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-xl shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-110 flex items-center space-x-2"
              >
                <span>❌</span>
                <span>Close</span>
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
