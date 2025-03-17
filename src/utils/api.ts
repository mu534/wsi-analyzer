export const fetchCaseData = async (caseId: string) => {
  // Simulate API call
  return {
    caseId,
    detectionType: "Abnormal Cell Cluster",
    confidenceScore: 88.5,
    imageSrc: "/assets/images/sample-slide.png",
  };
};
