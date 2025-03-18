import React from "react";
import { useCase } from "../context/CaseContext";

const SummaryPanel: React.FC = () => {
  const { caseData, detectionResults } = useCase();

  // Calculate total number of detected objects
  const totalDetections = detectionResults.length;

  return (
    <div
      className="p-4 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
      style={{ minWidth: "300px", minHeight: "150px" }}
    >
      <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
        Summary
      </h4>
      <div className="space-y-2">
        <p className="text-base text-gray-700">
          <span className="font-medium">Total Detections:</span>{" "}
          {totalDetections}
        </p>
        <p className="text-base text-gray-700">
          <span className="font-medium"> 🩺 Patient ID:</span>{" "}
          {caseData.patientId}
        </p>
        <p className="text-base text-gray-700">
          <span className="font-medium"> 🩸 Sample Type:</span>{" "}
          {caseData.sampleType}
        </p>
      </div>
    </div>
  );
};

export default SummaryPanel;
