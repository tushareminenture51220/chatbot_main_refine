import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import SliderForPreviewMulRes from "./SliderForPreviewMulRes";
const ChatBubbleBottomCenterIcon = dynamic(() =>
  import("@heroicons/react/24/solid/ChatBubbleLeftRightIcon")
);
const ArrowUturnLeftIcon = dynamic(() =>
  import("@heroicons/react/24/solid/ArrowUturnLeftIcon")
);
const CheckBadgeIcon = dynamic(() =>
  import("@heroicons/react/24/solid/CheckBadgeIcon")
);
const MultipleResponsePreveiw = ({ mlp }) => {
  const [allMLPs, setAllMLPs] = useState([]);

  return (
    <div className="rounded-md p-4 mb-4 relative h-auto">
      <div className="draft-preview">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ChatBubbleBottomCenterIcon className="w-6 h-6 text-blue-500" />

            <div className="font-bold text-lg">Trigger Text:</div>
          </div>
        </div>
        <ul className="pl-6 py-2 flex flex-wrap gap-1">
          {mlp?.triggerText?.map((text, idx) => (
            <li className="bg-blue-100 py-1 px-2 rounded-md " key={idx}>
              {text}
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-2">
          <ArrowUturnLeftIcon className="w-6 h-6 text-blue-500 rotate-180" />
          <div className="font-bold text-lg">
            Response:
            <span className="font-normal text-gray-500 text-sm">{` format (${mlp?.format})`}</span>
          </div>
        </div>
        <SliderForPreviewMulRes data={mlp?.responsesData} />
        {localStorage.getItem("MulResponseId") && (
          <div className="text-center mb-2">
            <button
              onClick={() => {
                localStorage.removeItem("MulResponseId");
                window.location.reload();
              }}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200"
            >
              <span className="relative px-5 py-1.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                Done
              </span>
              <CheckBadgeIcon className="w-5 h-5 mx-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleResponsePreveiw;
