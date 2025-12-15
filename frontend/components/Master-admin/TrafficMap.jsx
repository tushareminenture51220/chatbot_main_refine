import React, { useEffect, useState } from "react";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import ReactCountryFlag from "react-country-flag";
const getCountryISO2 = require("country-iso-3-to-2");
const geoUrl = "/features.json";

// Color scale for the map
const colorScale = scaleLinear().domain([0, 12]).range(["#bfdbfe", "#1e3a8a"]);

const TrafficMap = ({ usersData }) => {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipCountryCode, setTooltipCountryCode] = useState("");

  const trafficData = usersData.reduce((acc, user) => {
    const countryCode = user.location.country_code;
    acc[countryCode] = (acc[countryCode] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="w-full h-auto border relative bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl text-center -mb-[2.5rem] font-bold text-blue-800">
        Website Traffic Map
      </h2>

      <ComposableMap
        projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
        data-tip=""
      >
        {/* Globe background */}
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />

        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = geo.id; // Use the `id` as the country code (e.g., "IN", "US")
              const traffic = trafficData[getCountryISO2(countryCode)] || 0;

              return (
                <Geography
                  data-tooltip-id="my-tooltip"
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    setTooltipCountryCode(countryCode);
                    setTooltipContent(
                      `${geo.properties.name}: ${traffic} users`
                    );
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                    setTooltipCountryCode("");
                  }}
                  fill={colorScale(traffic)}
                  style={{
                    default: {
                      fill: colorScale(traffic),
                      outline: "none",
                    },
                    hover: {
                      fill: "#2563eb", // Darker blue on hover
                      outline: "none",
                    },
                    pressed: {
                      fill: "#1e3a8a", // Darkest blue on click
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <Tooltip id="my-tooltip">
        <div className="flex items-center">
          {tooltipCountryCode && (
            <div className="w-5 mr-2">
              <ReactCountryFlag
                countryCode={getCountryISO2(tooltipCountryCode)}
                svg
                style={{
                  width: "2em",
                  height: "2em",
                }}
                title={getCountryISO2(tooltipCountryCode)}
              />
            </div>
          )}
          <div>
            <h3 className="font-semibold">{tooltipContent}</h3>
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

export default TrafficMap;
