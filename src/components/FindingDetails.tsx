import React, { useState } from "react";
import { useCase } from "../context/CaseContext";

const FindingDetails: React.FC = () => {
  const { caseData } = useCase();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate confidence score dynamically
  const confidenceScore = caseData.detectionResults.length
    ? (
        caseData.detectionResults.reduce((sum, [, , , , label]) => {
          return sum + (label === "Circular_RBC" ? 98.5 : 0);
        }, 0) / caseData.detectionResults.length
      ).toFixed(1)
    : "N/A";

  const details = {
    "Case ID": caseData.patientId,
    "WSI ID": "WSI-2025-001",
    "Detection Type": "Abnormal Cell Cluster",
    "Confidence Score": `${confidenceScore}%`,
    Annotations: "Detected Region",
    "Current View": "Current View",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-full"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        {!isCollapsed && (
          <h3 className="text-lg font-semibold text-gray-800">
            Finding Details
          </h3>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
            />
          </svg>
        </button>
      </div>
      {!isCollapsed && (
        <div className="space-y-2 text-gray-700">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <span className="w-1/2 text-sm font-medium">{key}</span>
              <span className="w-1/2 text-sm bg-gray-100 p-1 rounded">
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindingDetails;
