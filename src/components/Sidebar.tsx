import React from "react";
import { useCase } from "../context/CaseContext";

const Sidebar: React.FC = () => {
  const { caseData } = useCase();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Finding Details</h2>
      <div className="space-y-2">
        <div>
          <strong>Case ID:</strong> {caseData.caseId}
        </div>
        <div>
          <strong>Detection Type:</strong> {caseData.detectionType}
        </div>
        <div>
          <strong>Confidence Score:</strong> {caseData.confidenceScore}%
        </div>
        <div>
          <strong>Annotations:</strong> Detected Region
        </div>
        <div>
          <strong>Current View:</strong> Whole Slide View
        </div>
      </div>
      {/* Add more UI elements like buttons or zoom controls if needed */}
    </div>
  );
};

export default Sidebar;
