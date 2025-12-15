import dynamic from "next/dynamic";
import React from "react";
const CircleStackIcon = dynamic(
  import("@heroicons/react/24/outline/CircleStackIcon")
);

const CircleLoader = () => {
  return (
    <div role="status">
      <CircleStackIcon className="inline w-10 h-10 mr-2 text-gray-200 animate-spin fill-blue-600" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default CircleLoader;
