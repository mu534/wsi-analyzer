import React from "react";
import { useCase } from "../context/CaseContext";

const Sidebar: React.FC = () => {
  const { caseData } = useCase();

  return (
    <div className="p-4 bg-green-100 rounded-md w-80 h-full">
      <div className="space-y-4">
        {/* RBC Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">RBC</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-200">
                <th className="border border-gray-300 p-2 text-left"></th>
                <th className="border border-gray-300 p-2 text-left">Count</th>
                <th className="border border-gray-300 p-2 text-left">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(caseData.rbcData).map(([key, value]) => (
                <tr key={key}>
                  <td className="border border-gray-300 p-2">{key}</td>
                  <td className="border border-gray-300 p-2">{value.count}</td>
                  <td className="border border-gray-300 p-2">
                    {value.percentage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* WBC Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">WBC</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-200">
                <th className="border border-gray-300 p-2 text-left"></th>
                <th className="border border-gray-300 p-2 text-left">Count</th>
                <th className="border border-gray-300 p-2 text-left">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(caseData.wbcData).map(([key, value]) => (
                <tr key={key}>
                  <td className="border border-gray-300 p-2">{key}</td>
                  <td className="border border-gray-300 p-2">{value.count}</td>
                  <td className="border border-gray-300 p-2">
                    {value.percentage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Platelets Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Platelets</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-200">
                <th className="border border-gray-300 p-2 text-left"></th>
                <th className="border border-gray-300 p-2 text-left">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Count</td>
                <td className="border border-gray-300 p-2">
                  {caseData.platelets.count}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Percentage</td>
                <td className="border border-gray-300 p-2">
                  {caseData.platelets.percentage}
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
