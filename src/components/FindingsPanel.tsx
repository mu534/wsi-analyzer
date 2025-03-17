import React from "react";
import { useCase } from "../context/CaseContext";

const FindingsPanel: React.FC = () => {
  const { caseData } = useCase();
  const findings = {
    RBC: caseData.detectionResults
      .filter((result) => result[4] === "Circular_RBC")
      .map((result, index) => ({
        name: `${result[4]} ${index + 1}`,
        count: 1, // Placeholder, count each detection
        percentage: "N/A", // Placeholder, calculate if data available
      })),
  };

  return (
    <div className="space-y-4 text-gray-800 dark:text-gray-200">
      <h2 className="text-xl font-semibold">Findings</h2>
      {Object.entries(findings).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-lg font-medium">{category}</h3>
          <div className="grid grid-cols-3 gap-2 text-sm border-b border-gray-200 dark:border-gray-600 pb-2">
            <div className="font-semibold">Type</div>
            <div className="font-semibold">Count</div>
            <div className="font-semibold">Percentage</div>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <div>{item.name}</div>
                <div>{item.count}</div>
                <div>{item.percentage}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FindingsPanel;
