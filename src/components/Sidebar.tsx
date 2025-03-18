import React from "react";
import { useCase } from "../context/CaseContext";

const Sidebar: React.FC = () => {
  const { caseData } = useCase();

  // Override caseData with specific values
  const updatedCaseData = {
    ...caseData,
    rbcData: {
      "Angled Cells": { count: 222, percentage: "67%" },
      "Borderline Ovalocytes": { count: 50, percentage: "20%" },
      "Burr Cells": { count: 87, percentage: "34%" },
      "Fragmented Cells": { count: 2, percentage: "0.12%" },
      Ovalocytes: { count: 0, percentage: "0%" },
      "Rounded RBC": { count: 0, percentage: "0%" },
      Teardrops: { count: 0, percentage: "0%" },
    },
    wbcData: {
      Basophil: { count: 222, percentage: "67%" },
      Eosinophil: { count: 50, percentage: "20%" },
      Lymphocyte: { count: 87, percentage: "34%" },
      Monocyte: { count: 2, percentage: "0.12%" },
    },
    platelets: {
      count: 222,
      percentage: "22%",
    },
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-200 to-green-100 rounded-xl shadow-lg w-full">
      <div className="space-y-6">
        {/* RBC Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">🩸 RBC</h3>
          <table className="w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 text-left"></th>
                <th className="p-3 text-left">Count</th>
                <th className="p-3 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(updatedCaseData.rbcData).map(([key, value]) => (
                <tr key={key} className="hover:bg-blue-100 transition">
                  <td className="p-3 border-b">{key}</td>
                  <td className="p-3 border-b">{value.count}</td>
                  <td className="p-3 border-b">{value.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* WBC Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">🦠 WBC</h3>
          <table className="w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="p-3 text-left"></th>
                <th className="p-3 text-left">Count</th>
                <th className="p-3 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(updatedCaseData.wbcData).map(([key, value]) => (
                <tr key={key} className="hover:bg-green-100 transition">
                  <td className="p-3 border-b">{key}</td>
                  <td className="p-3 border-b">{value.count}</td>
                  <td className="p-3 border-b">{value.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Platelets Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">🧬 Platelets</h3>
          <table className="w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
            <thead>
              <tr className="bg-purple-500 text-white">
                <th className="p-3 text-left"></th>
                <th className="p-3 text-left">Count</th>
                <th className="p-3 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-purple-100 transition">
                <td className="p-3 border-b">Count</td>
                <td className="p-3 border-b">
                  {updatedCaseData.platelets.count}
                </td>
                <td className="p-3 border-b"></td>
              </tr>
              <tr className="hover:bg-purple-100 transition">
                <td className="p-3 border-b">Percentage</td>
                <td className="p-3 border-b"></td>
                <td className="p-3 border-b">
                  {updatedCaseData.platelets.percentage}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
