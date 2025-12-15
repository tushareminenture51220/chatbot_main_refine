import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ statsData, livechatValue }) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});
  const [valuesArray, setValuesArray] = useState([]);

  useEffect(() => {
    const valuesArrayData = statsData.map((item) => item.value);
    setValuesArray([...valuesArrayData, livechatValue]);
  }, [statsData, livechatValue]);

  useEffect(() => {
    setChartData({
      labels: [
        "Total Unique Users",
        "Total Chatbot Sessions",
        "Total Users Queries",
        "First Contact Resolution (FCR)",
        "LiveChat Queries Resolution",
      ],
      datasets: [
        {
          label: "Count",
          data: valuesArray,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.4)",
          fill: false,
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
          text: "Overall Performance",
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    });
  }, [valuesArray]);

  return (
    <div className="w-full h-full m-auto border rounded-lg bg-white">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default LineChart;
