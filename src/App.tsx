import React, { useState, useEffect } from "react";
import { CaseProvider } from "./context/CaseContext";
import ImageViewer from "./components/ImageViewer";
import FindingsPanel from "./components/FindingsPanel";
import ZoomedHub from "./components/ZoomedHub";
import ReportButton from "./components/ReportButton";
import ThemeToggle from "./components/ThemeToggle";

const App: React.FC = () => {
  const [region, setRegion] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [detectionResults, setDetectionResults] = useState<unknown[]>([]);

  useEffect(() => {
    // Fetch detection results from output.json
    fetch("/output.json")
      .then((res) => res.json())
      .then((data) => setDetectionResults(data.detection_results))
      .catch((err) => console.error("Error fetching detection results:", err));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <CaseProvider>
      <div
        className={`container mx-auto p-4 h-screen ${
          theme === "dark" ? "dark" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Whole Slide Image Viewer
          </h1>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
        <div className="grid grid-cols-4 grid-rows-[auto_1fr] h-[calc(100%-2.5rem)] gap-4">
          {/* Left: Findings Panel */}
          <div className="col-span-1 row-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-y-auto">
            <FindingsPanel />
          </div>
          {/* Center: WSI Viewer */}
          <div className="col-span-2 row-span-2 bg-gray-800 dark:bg-gray-900 rounded-lg overflow-hidden">
            <ImageViewer
              onRegionChange={setRegion}
              detectionResults={detectionResults}
            />
          </div>
          {/* Top-Right: Zoomed Hub View */}
          <div className="col-span-1 row-span-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
            <ZoomedHub region={region} />
          </div>
          {/* Bottom-Right: Report Button */}
          <div className="col-span-1 row-span-1 flex items-end justify-center">
            <ReportButton />
          </div>
        </div>
      </div>
    </CaseProvider>
  );
};

export default App;
