export interface CaseData {
  patientId: string;
  sampleType: string;
  imageSrc: string;
  filename: string;
  detectionResults: [number, number, number, number, string][];
  rbcData: { [key: string]: { count: number; percentage: string } }; // RBC categories
  wbcData: { [key: string]: { count: number; percentage: string } }; // WBC categories
  platelets: { count: number; percentage: string }; // Platelets
}

export interface CaseContextType {
  caseData: CaseData;
}
