import React, { createContext, useContext, useState, ReactNode } from "react";

interface CaseData {
  patientId: string;
  filename: string;
  sampleType: string;
  imageSrc: string;
  detectionResults: [number, number, number, number, string][];
}

interface CaseContextType {
  caseData: CaseData;
  setCaseData: (data: CaseData) => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider = ({ children }: { children: ReactNode }) => {
  const [caseData, setCaseData] = useState<CaseData>({
    patientId: "7",
    filename: "7_20241209_024613.png",
    sampleType: "blood",
    imageSrc: "/assets/images/7_20241209_024613.png", // Update path to match your image
    detectionResults: [
      [121, 4, 163, 45, "Circular_RBC"],
      [396, 312, 433, 353, "Circular_RBC"],
      [388, 90, 428, 130, "Circular_RBC"],
      // Add all other detection results from the JSON here (omitted for brevity, add manually or fetch dynamically)
      // Example: [334, 157, 373, 199, 'Circular_RBC'],
    ],
  });

  return (
    <CaseContext.Provider value={{ caseData, setCaseData }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error("useCase must be used within a CaseProvider");
  }
  return context;
};
