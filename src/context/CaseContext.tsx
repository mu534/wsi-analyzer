import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CaseData, CaseContextType } from "./types";
import WSIImage from "../assets/images/7_20241209_024613.png";

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [caseData, setCaseData] = useState<CaseData>({
    patientId: "Case-2025-001",
    sampleType: "Blood",
    imageSrc: WSIImage,
    detectionResults: [],
    rbcData: {
      "Angle Cells": { count: 222, percentage: "67%" },
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
    platelets: { count: 222, percentage: "222" },
  });

  useEffect(() => {
    console.log("CaseContext: Initial imageSrc:", caseData.imageSrc);
    fetch("/output.json")
      .then((res) => res.json())
      .then((data) => {
        const results = data.inference_results.output.detection_results as [
          number,
          number,
          number,
          number,
          string
        ][];

        // Filter detectionResults to focus on a specific region (e.g., top-left quadrant)
        const filteredResults = results
          .filter(([x, y]) => {
            return x < 300 && y < 300; // Example: Only include boxes in the top-left 300x300 area
          })
          .slice(0, 20); // Limit to 20 boxes for fewer, focused boxes

        setCaseData((prev) => ({
          ...prev,
          detectionResults: filteredResults,
        }));
      })
      .catch((err) => console.error("Error fetching output.json:", err));
  }, []);

  return (
    <CaseContext.Provider value={{ caseData }}>{children}</CaseContext.Provider>
  );
};

export const useCase = (): CaseContextType => {
  const context = useContext(CaseContext);
  if (!context) throw new Error("useCase must be used within a CaseProvider");
  return context;
};
