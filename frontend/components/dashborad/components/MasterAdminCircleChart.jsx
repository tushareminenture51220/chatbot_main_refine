import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// Example Data
const backgroundColors = [
  "#8E44AD", // Solid Violet
  "#FF5C8D", // Solid Pink
  "#36A2EB", // Solid Blue
  "#FFCD56", // Solid Yellow
  "#4BC0C0", // Solid Teal
  "#9966FF", // Solid Purple
  "#FF9F40", // Solid Orange
  "#FF5733", // Solid Red
  "#33FF57", // Solid Green
];
const borderColors = ["#fff"];

export default function MasterAdminCircleChart({ dataMA }) {
  // Transform data into chart format based on the prop
  const labels = dataMA.map((account) => account.companyName);
  const usersData = dataMA.map((account) => account.users.length);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Users per Account",
        data: usersData,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      className="chart-container bg-white p-8 border"
      style={{ width: "100%", margin: "0 auto" }}
    >
      <h2 className="text-center">Account Users Distribution</h2>
      <Pie data={data} />
    </div>
  );
}
