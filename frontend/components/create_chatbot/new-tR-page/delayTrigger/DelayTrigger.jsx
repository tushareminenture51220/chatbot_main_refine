import { useWorkFlowContextData } from "@/context/WorkFlowContext";
import ClockIcon from "@heroicons/react/24/solid/ClockIcon";
import React from "react";

const DelayTrigger = () => {
  const { nextActionDelayTime, setNextActionDelayTime } =
    useWorkFlowContextData();
  return (
    <>
      <div className="flex justify-between items-center bg-white my-2 p-1 rounded-md">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-gray-500 mb-1" />
          <div className="grid">
            <span className="font-semibold text-sm">Delay for Next Action</span>
            <p className="mt-0 mb-2 font-normal text-sm leading-4 tracking-tight pb-0 text-[#647491]">
              Give the visitor time to read this message.
            </p>
          </div>
        </div>
        <div className="relative w-16">
          <input
            type="number"
            className="delayInput bg-gray-50 w-16 text-md border outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm rounded-lg pl-2 pr-8 py-2"
            placeholder="0"
            min="0"
            value={nextActionDelayTime}
            max="99"
            onChange={(e) => setNextActionDelayTime(e.target.value)}
            maxLength="2"
            onInput={(e) => {
              if (e.target.value.length > 2) {
                e.target.value = e.target.value.slice(0, 2);
              }
            }}
          />
          <div className="absolute bottom-0.5 inset-y-0 end-0 flex items-center pr-3 pointer-events-none text-gray-600 z-0">
            <span>sec</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .delayInput::-webkit-outer-spin-button,
        .delayInput::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .delayInput {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
};

export default DelayTrigger;
