import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const PieChart = ({ botCount, liveCount }) => {
  const [pieChartData, setPieChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});
  useEffect(() => {
    setPieChartData({
      labels: ["Bot chat", "Live chat"],
      datasets: [
        {
          label: "Count",
          data: [botCount, liveCount],
          borderColor: "rgb(255, 255, 255)",
          backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        },
      ],
    });
    setChartOptions({
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Query Resolution",
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    });
  }, [liveCount, botCount]);
  return (
    <div className="w-full relative  h-[60vh] m-auto p-4 border rounded-lg bg-white">
      <Doughnut data={pieChartData} options={chartOptions} />
    </div>
  );
};

export default PieChart;
