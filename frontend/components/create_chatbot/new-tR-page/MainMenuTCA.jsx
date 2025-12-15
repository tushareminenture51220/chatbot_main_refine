import React from "react";
import dynamic from "next/dynamic";
const RocketLaunchIcon = dynamic(() =>
  import("@heroicons/react/24/solid/RocketLaunchIcon")
);
const ServerStackIcon = dynamic(() =>
  import("@heroicons/react/24/solid/ServerStackIcon")
);
const QuestionMarkCircleIcon = dynamic(() =>
  import("@heroicons/react/24/solid/QuestionMarkCircleIcon")
);
const ArrowsPointingOutIcon = dynamic(() =>
  import("@heroicons/react/24/solid/ArrowsPointingOutIcon")
);
const MainMenuTCA = ({
  activeTab,
  setActiveTab,
  setIsOpenBottomSubMenusTR,
}) => {
  return (
    <div className="relative">
      <div className="grid justify-around items-center text-center absolute right-0 translate-y-1/2">
        <div className="relative flex justify-start items-center">
          <button
            onClick={() => {
              setActiveTab("triggers");
              setIsOpenBottomSubMenusTR(true);
            }}
            type="button"
            title="Add Triggers"
            className="relative text-white bg-gradient-to-r mb-2 align-middle border-4 border-white from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 rounded-full text-center w-16 h-16 grid items-center justify-center"
          >
            <ServerStackIcon className="w-7 h-7 text-center align-middle" />
          </button>
          <p className="z-10 ml-2 mb-2 w-max px-3 py-2 text-sm font-medium text-gray-800 bg-white rounded-lg shadow-sm duration-300">
            Triggers
          </p>
        </div>
        <div className="relative flex justify-start items-center">
          <button
            onClick={() => {
              setActiveTab("conditions");
              setIsOpenBottomSubMenusTR(true);
            }}
            type="button"
            title="Add Conditions"
            className="relative text-white bg-gradient-to-r mb-2 align-middle border-4 border-white from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 rounded-full text-center w-16 h-16 grid items-center justify-center "
          >
            <QuestionMarkCircleIcon className="w-7 h-7 text-center align-middle" />
          </button>

          <p className="z-10 ml-2 mb-2 w-max px-3 py-2 text-sm font-medium text-gray-800 rounded-lg shadow-sm duration-300 bg-white">
            Conditions
          </p>
        </div>
        <div className="relative flex justify-start items-center">
          <button
            onClick={() => {
              setActiveTab("actions");
              setIsOpenBottomSubMenusTR(true);
            }}
            title="Add Actions"
            type="button"
            className="relative text-white bg-gradient-to-r mb-2 align-middle border-4 border-white from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 rounded-full text-center w-16 h-16 grid items-center justify-center "
          >
            <RocketLaunchIcon className="w-7 h-7 text-center align-middle" />
          </button>

          <p className="z-10 ml-2 mb-2 w-max px-3 py-2 text-sm font-medium text-gray-800 bg-white rounded-lg shadow-sm duration-300">
            Actions
          </p>
        </div>
        <div className="relative flex justify-start items-center">
          <button
            onClick={() => {
              setActiveTab("outOfFlow");
              setIsOpenBottomSubMenusTR(true);
            }}
            title="Add Actions"
            type="button"
            className="relative text-white bg-gradient-to-r mb-2 align-middle border-4 border-white from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 rounded-full text-center w-16 h-16 grid items-center justify-center "
          >
            <ArrowsPointingOutIcon className="w-7 h-7 text-center align-middle" />
          </button>

          <p className="z-10 ml-2 mb-2 w-max px-3 py-2 text-sm font-medium text-gray-800 bg-white rounded-lg shadow-sm duration-300">
            Out of Flow
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainMenuTCA;
