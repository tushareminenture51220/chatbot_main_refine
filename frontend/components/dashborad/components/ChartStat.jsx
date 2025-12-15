import { useState } from "react";

const ChartStat = () => {
  const [data, setData] = useState([
    {
      label: "Monday",
      liveChat: 5,
      botChat: 8,
    },
    {
      label: "Tuesday",
      liveChat: 10,
      botChat: 20,
    },
    {
      label: "Wednesday",
      liveChat: 15,
      botChat: 35,
    },
    {
      label: "Thursday",
      liveChat: 20,
      botChat: 40,
    },
    {
      label: "Friday",
      liveChat: 26,
      botChat: 55,
    },
  ]);

  const [tooltip, setTooltip] = useState(null);

  const handleDataPointHover = (index, event) => {
    const rect = event.target.getBoundingClientRect();
    const x = rect.left + window.scrollX + rect.width / 2;
    const y = rect.top + window.scrollY - 10;
    setTooltip({ index, x, y, dataPoint: data[index] });
  };

  const handleDataPointLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Query Resolution</h1>
      <div className="flex">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span>Live Chat</span>
            <div className="w-4 h-4 bg-green-500 rounded-full ml-4 mr-2"></div>
            <span>Bot Chat</span>
          </div>

          <svg
            viewBox={`0 0 ${data.length * 40} 100`}
            className="w-full h-32 mt-4 cursor-pointer"
          >
            {/* Render lines, dots, and data points with animations */}
            {data.map((point, index) => (
              <g key={index}>
                <circle
                  cx={index * 40}
                  cy={100 - point.liveChat}
                  r="6"
                  fill="#3490dc"
                  onMouseOver={(e) => handleDataPointHover(index, e)}
                  onMouseLeave={handleDataPointLeave}
                />
                <circle
                  cx={index * 40}
                  cy={100 - point.botChat}
                  r="6"
                  fill="#38a169"
                  onMouseOver={(e) => handleDataPointHover(index, e)}
                  onMouseLeave={handleDataPointLeave}
                />
              </g>
            ))}
            {data.map((point, index) => (
              <line
                key={index}
                x1={index * 40}
                y1={100 - point.liveChat}
                x2={(index + 1) * 40}
                y2={data[index + 1] ? 100 - data[index + 1].liveChat : 0}
                stroke="#3490dc"
                strokeWidth="2"
              />
            ))}
            {data.map((point, index) => (
              <line
                key={`bot-${index}`}
                x1={index * 40}
                y1={100 - point.botChat}
                x2={(index + 1) * 40}
                y2={data[index + 1] ? 100 - data[index + 1].botChat : 0}
                stroke="#38a169"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* Render labels with animations */}
          <div className="flex justify-between mt-4">
            {data.map((point, index) => (
              <div key={index} className="text-xs text-gray-600 cursor-pointer">
                <span className="underline">{point.label}</span>
              </div>
            ))}
          </div>

          {/* Render realistic tooltip */}
          {tooltip && (
            <div
              className="absolute bg-white border border-gray-300 p-2 rounded"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <div>{tooltip.dataPoint.label}</div>
              <div>
                <strong>Bot Chat:</strong> {tooltip.dataPoint.botChat}
              </div>
              <div>
                <strong>Live Chat:</strong> {tooltip.dataPoint.liveChat}
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        circle:hover {
          animation: changeRadius 0.3s forwards;
        }

        @keyframes changeRadius {
          from {
            r: 6;
          }
          to {
            r: 8;
          }
        }
      `}</style>
    </div>
  );
};

export default ChartStat;
