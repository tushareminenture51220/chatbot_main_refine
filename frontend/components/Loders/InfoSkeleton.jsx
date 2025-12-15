import React from "react";

const InfoSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex justify-start items-start gap-2 px-4 pt-3">
        <div className="w-6 h-7 bg-blue-200 rounded-full"></div>
        <div className="text-lg font-semibold bg-blue-200 h-6 w-32 rounded"></div>
      </div>
      <hr className="mt-3" />

      <div className="bg-white w-[85%] my-2 rounded-md mx-auto px-4 py-4 shadow-sm flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-start gap-4 text-gray-600"
          >
            <div className="w-5 h-5 bg-blue-200 rounded-full"></div>
            <div className="text-md font-semibold flex-grow bg-blue-200 h-6 w-36 rounded"></div>
          </div>
        ))}
      </div>
      <div className="bg-white w-[85%] my-2 rounded-md mx-auto px-4 py-4 shadow-sm flex flex-col gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-start gap-4 text-gray-600"
          >
            <div className="w-5 h-5 bg-blue-200 rounded-full"></div>
            <div className="text-sm font-semibold bg-blue-200 flex-grow h-6 w-40 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSkeleton;
