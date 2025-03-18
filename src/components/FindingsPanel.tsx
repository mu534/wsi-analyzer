import React from "react";

const FindingsPanel: React.FC = () => {
  // Mock data to match wireframe (replace with actual data processing later)
  const findings = {
    RBC: [
      { name: "Angled Cells", count: 222, percentage: "67%" },
      { name: "Borderline Ovalocytes", count: 50, percentage: "20%" },
      { name: "Burr Cells", count: 87, percentage: "34%" },
      { name: "Fragmented Cells", count: 2, percentage: "0.12%" },
      { name: "Ovalocytes", count: 0, percentage: "0%" },
      { name: "Rounded RBC", count: 0, percentage: "0%" },
      { name: "Teardrops", count: 0, percentage: "0%" },
    ],
    WBC: [
      { name: "Basophil", count: 222, percentage: "67%" },
      { name: "Eosinophil", count: 50, percentage: "20%" },
      { name: "Lymphocyte", count: 87, percentage: "34%" },
      { name: "Monocyte", count: 2, percentage: "0.12%" },
    ],
    Platelets: [
      { name: "Count", count: 222, percentage: "" },
      { name: "Percentage", count: "", percentage: "222" },
    ],
  };

  return (
    <div className="space-y-4 text-gray-800 dark:text-gray-200">
      {Object.entries(findings).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold">{category}</h3>
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
