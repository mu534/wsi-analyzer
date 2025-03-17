import React from "react";
import { jsPDF } from "jspdf";
import { useCase } from "../context/CaseContext";

const ReportButton: React.FC = () => {
  const { caseData } = useCase();

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Whole Slide Image Report", 10, 10);
    doc.text(`Patient ID: ${caseData.patientId}`, 10, 20);
    doc.text(`Sample Type: ${caseData.sampleType}`, 10, 30);
    doc.text(`Filename: ${caseData.filename}`, 10, 40);
    doc.text("Findings:", 10, 50);
    caseData.detectionResults.forEach((result, index) => {
      doc.text(
        `${result[4]} - x:${result[0]}, y:${result[1]}, w:${
          result[2] - result[0]
        }, h:${result[3] - result[1]}`,
        10,
        60 + index * 10
      );
    });
    doc.save("report.pdf");
  };

  return (
    <button
      onClick={handleExportPDF}
      className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Report
    </button>
  );
};

export default ReportButton;
