import React from "react";

const ChatwithAssistantForm = ({
  handleSubmit,
  handleChange,
  assiWaitingTimeAndMessage,
}) => {
  return (
    <>
      <div className="flex flex-col justify-between items-center bg-white my-2 px-2 pt-4 pb-2 rounded-md">
        <div className="flex items-center gap-2">
          <svg
            className="w-12 h-12 text-gray-500 mb-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fill="currentColor"
              d="M5 6a4 4 0 1 1 8 0a4 4 0 0 1-8 0m4-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6M2 13c0-1.113.903-2 2.009-2h6.248a5.5 5.5 0 0 0-.657 1H4.009C3.448 12 3 12.447 3 13c0 1.309.622 2.284 1.673 2.953C5.743 16.636 7.265 17 9 17q.3 0 .592-.015q.261.513.618.958Q9.617 18 9 18c-1.855 0-3.583-.386-4.865-1.203C2.833 15.967 2 14.69 2 13m17 1.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0M14.5 12a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5H16a.5.5 0 0 0 0-1h-1v-1.5a.5.5 0 0 0-.5-.5"
            ></path>
          </svg>
          <div className="grid">
            <span className="font-semibold text-sm">
              Setup Assistant Waiting Time
            </span>
            <p className="mt-0 mb-2 font-normal text-sm leading-4 tracking-tight pb-0 text-[#647491]">
              This is the waiting period for users until the assistant joins; if
              not, further actions will proceed.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-full py-1 px-5">
          <div className="relative w-full">
            <textarea
              className="bg-gray-50 w-full text-md border outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm rounded-lg pl-2 pr-8 py-2"
              placeholder="Enter Assistant Waiting Message (Max 100 characters)"
              max="99"
              value={assiWaitingTimeAndMessage?.assistantWaitingMessage}
              onChange={handleChange}
              name="assistantWaitingMessage"
              maxLength="100"
              onInput={(e) => {
                if (e.target.value.length > 100) {
                  e.target.value = e.target.value.slice(0, 2);
                }
              }}
            />
          </div>
          <div className="flex justify-center items-center gap-2 w-full px-10 py-2">
            <div className="relative w-full">
              <input
                type="number"
                className="delayInput bg-gray-50 w-full text-md border outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm rounded-lg pl-2 pr-8 py-2"
                placeholder="00"
                min="0"
                value={assiWaitingTimeAndMessage?.min}
                max="99"
                onChange={handleChange}
                name="min"
                maxLength="2"
                onInput={(e) => {
                  if (e.target.value.length > 2) {
                    e.target.value = e.target.value.slice(0, 2);
                  }
                }}
              />
              <div className="absolute bottom-0.5 inset-y-0 end-0 flex items-center pr-3 pointer-events-none text-gray-600 z-0">
                <span>min</span>
              </div>
            </div>
            <div className="relative w-full">
              <input
                type="number"
                className="delayInput bg-gray-50 w-full text-md border outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm rounded-lg pl-2 pr-8 py-2"
                placeholder="00"
                min="0"
                value={assiWaitingTimeAndMessage?.sec}
                max="99"
                name="sec"
                onChange={handleChange}
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

          <button
            type="submit"
            className="text-blue-700 w-full p-0 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Submit
          </button>
        </form>
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

export default ChatwithAssistantForm;
