import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ statsData, livechatValue }) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});
  const [valuesArray, setValuesArray] = useState([]);

  useEffect(() => {
    const valuesArrayData = statsData.map((item) => item.value);
    setValuesArray([...valuesArrayData, livechatValue]);
  }, [statsData, livechatValue]);
  // console.log(valuesArray);
  useEffect(() => {
    setChartData({
      labels: [
        "Total Unique Users",
        "Total Chatbot Sessions",
        "Total Users Queries",
        "Form Filling Ratio",
        "LiveChat Queries Resolution",
      ],
      datasets: [
        {
          label: "Count",
          data: valuesArray,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgb(53, 162, 235, 0.4",
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
    <>
      <div className="w-full h-[100%] p-4 m-auto border rounded-lg bg-white">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default BarChart;
