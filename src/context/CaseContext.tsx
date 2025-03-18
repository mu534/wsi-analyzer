import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import WSIImage from "../assets/images/7_20241209_024613.png";

// 📝 Define CaseData Interface
interface CaseData {
  filename: unknown;
  patientId: string;
  sampleType: string;
  imageSrc: string;
  detectionResults: [number, number, number, number, string][];
  rbcData: Record<string, { count: number; percentage: string }>;
  wbcData: Record<string, { count: number; percentage: string }>;
  platelets: { count: number; percentage: string };
}

interface CaseContextType {
  caseData: CaseData;
  detectionResults: [number, number, number, number, string][];
}

// 🌟 Create Context
const CaseContext = createContext<CaseContextType | undefined>(undefined);

// 🏥 Case Provider Component
export const CaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [caseData, setCaseData] = useState<CaseData>({
    filename: null,
    patientId: "Case-2025-001",
    sampleType: "Blood",
    imageSrc: WSIImage,
    detectionResults: [],
    rbcData: {
      "Angled Cells": { count: 222, percentage: "67%" },
      "Borderline Ovalocytes": { count: 50, percentage: "20%" },
      "Burr Cells": { count: 87, percentage: "34%" },
      "Fragmented Cells": { count: 2, percentage: "0.12%" },
      "Ovalocytes Rounded RBC": { count: 5, percentage: "0.3%" },
      Teardrops: { count: 10, percentage: "0.5%" },
    },
    wbcData: {
      Basophil: { count: 222, percentage: "67%" },
      Eosinophil: { count: 50, percentage: "20%" },
      Lymphocyte: { count: 87, percentage: "34%" },
      Monocyte: { count: 2, percentage: "0.12%" },
    },
    platelets: { count: 222, percentage: "22%" }, // Fixed unrealistic 222%
  });

  // 📡 Fetch Data from JSON Output
  useEffect(() => {
    console.log(
      "%cCaseContext: Fetching Data...",
      "color: cyan; font-weight: bold;"
    );

    fetch("/output.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data.inference_results?.output?.detection_results) {
          throw new Error("Invalid JSON structure: Missing detection_results");
        }

        const results = data.inference_results.output.detection_results as [
          number,
          number,
          number,
          number,
          string
        ][];

        // 🎯 Filter Results to Focus on Top-Left Quadrant (Optional)
        const filteredResults = results
          .filter(([x, y]) => x < 300 && y < 300) // Focus on top-left 300x300 region
          .slice(0, 20); // Limit to 20 results for clarity

        console.log(
          "%cCaseContext: Successfully Loaded Data!",
          "color: limegreen; font-weight: bold;"
        );

        setCaseData((prev) => ({
          ...prev,
          detectionResults: filteredResults,
        }));
      })
      .catch((err) => {
        console.error(
          "%cCaseContext: Error Fetching Data!",
          "color: red; font-weight: bold;",
          err
        );
      });
  }, []);

  // Provide Context Value
  const value = {
    caseData,
    detectionResults: caseData.detectionResults,
  };

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
};

// 🎯 Custom Hook for CaseContext
export const useCase = (): CaseContextType => {
  const context = useContext(CaseContext);
  if (!context) throw new Error("useCase must be used within a CaseProvider");
  return context;
};
