import React from "react";

const ToMsg = (props) => {
  const { letter, textMsg, assiUnavailableFromData, customFormsData } = props;
  // console.log(assiUnavailableFromData, "assiUnavailableFromData");
  const getBackgroundColor = (letter) => {
    const colors = [
      "rgb(255, 159, 0)",
      "rgb(0, 180, 108)",
      "rgb(34, 102, 221)",
      "rgb(255, 62, 47)",
      "rgb(104, 109, 224)",
      "rgb(196, 58, 34)",
      "rgb(0, 166, 153)",
      "rgb(19, 77, 173)",
      "rgb(255, 87, 34)",
      "rgb(63, 81, 181)",
      "rgb(255, 133, 0)",
      "rgb(0, 150, 136)",
      "rgb(13, 71, 161)",
      "rgb(255, 47, 60)",
      "rgb(83, 109, 254)",
    ];

    const letterCode = letter?.charCodeAt(0) - 65; // Assuming uppercase letters
    const colorIndex = letterCode % colors.length;

    return colors[colorIndex];
  };

 // console.log("customFormsData", props);
  return (
    <div className="col-start-1 col-end-8 p-3 rounded-lg rounded-tl-none">
      <div className="flex flex-row items-center">
        <div
          style={{ backgroundColor: getBackgroundColor(letter) }}
          className="flex text-white items-center justify-center h-10 w-10 rounded-full flex-shrink-0"
        >
          {letter}
        </div>
        <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl rounded-tl-none">
          <div>{textMsg}</div>
          {assiUnavailableFromData && (
            <div className="flex flex-col items-start">
              <h3 className="font-semibold mb-2">
                Assistant Unavailable – User Contact Details
              </h3>
              <hr className="w-full border-t border-gray-300 mb-2" />
              <h3 className="font-semibold mb-2">
                {assiUnavailableFromData?.email}
              </h3>
              <hr className="w-full border-t border-gray-300 mb-2" />
              <h3 className="font-semibold mb-2">
                {assiUnavailableFromData?.phone}
              </h3>
              <hr className="w-full border-t border-gray-300 mb-2" />
              <p>{assiUnavailableFromData?.message}</p>
            </div>
          )}
          {customFormsData && (
            <div className="flex flex-col items-start">
              {Object.entries(customFormsData).map(([key, value]) => (
                <div key={key} className="w-full text-left">
                  {key !== "Long Text" ? (
                    <>
                      <h3 className="font-semibold mb-2 text-left">{value}</h3>
                      <hr className="w-full border-t border-gray-300 mb-2" />
                    </>
                  ) : (
                    <>
                      <p>{value}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToMsg;
