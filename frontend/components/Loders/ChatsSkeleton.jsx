import React from "react";

const ChatsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="px-4 py-0 h-16 flex justify-between">
        <div className="flex justify-start items-center gap-2 px-4 pt-3">
          <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
          <div className="text-lg font-semibold bg-blue-200 h-6 w-32 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-200 w-6 h-6 rounded-full"></div>
          <div className="bg-blue-200 w-6 h-6 rounded-full"></div>
        </div>
      </div>
      <br />
      <hr className="mt-1" />
      <br />
      <div className="flex-grow h-96 bg-blue-200 rounded-md"></div>
      <div className="px-4 py-4 h-16 flex items-center gap-2">
        <div className="bg-blue-200 w-5/6 h-12 rounded-full"></div>
        <div className="bg-blue-200 w-24 h-12 rounded-full"></div>
      </div>
    </div>
  );
};

export default ChatsSkeleton;
