import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import InitialResponseLabel from "./InitialResponseLabel";
import SliderForPreviewMulRes from "./SliderForPreviewMulRes";
const ChatBubbleBottomCenterIcon = dynamic(() =>
  import("@heroicons/react/24/solid/ChatBubbleLeftRightIcon")
);
const PencilSquareIcon = dynamic(() =>
  import("@heroicons/react/24/outline/PencilSquareIcon")
);
const TrashIcon = dynamic(() =>
  import("@heroicons/react/24/outline/TrashIcon")
);
const ArrowUturnLeftIcon = dynamic(() =>
  import("@heroicons/react/24/solid/ArrowUturnLeftIcon")
);
const PhotoIcon = dynamic(() => import("@heroicons/react/24/solid/PhotoIcon"));
const RectangleStackIcon = dynamic(() =>
  import("@heroicons/react/24/solid/RectangleStackIcon")
);
const LightBulbIcon = dynamic(() =>
  import("@heroicons/react/24/solid/LightBulbIcon")
);
const ArrowTopRightOnSquareIcon = dynamic(() =>
  import("@heroicons/react/24/outline/ArrowTopRightOnSquareIcon")
);
const PreviewCard = ({
  response,
  index,
  setIsLoading,
  handleEditResponse,
  handleDeleteResponse,
}) => {
  const [showTab, setShowTab] = useState(false);
  const [showInitialResTag, setShowInitialResTag] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowInitialResTag(true)}
      onMouseLeave={() => setShowInitialResTag(false)}
      key={response._id}
      className="bg-white rounded-md p-4 mb-4 relative w-full h-auto"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {!showTab ? (
            <ChatBubbleBottomCenterIcon className="w-6 h-6 text-blue-500" />
          ) : (
            response?.suggestedTrigger?.length > 0 && (
              <LightBulbIcon className="w-6 h-6 text-blue-500" />
            )
          )}
          <div className="font-bold text-lg">
            {!showTab
              ? "Trigger Text:"
              : response?.suggestedTrigger?.length > 0 && "Suggestion:"}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!response.commonData == true ? (
            <>
              {response.multipleRes == false &&
                response.responseMsg != "Would you like us to contact you?" && (
                  <>
                    <div className="group">
                      <p className="group-hover:block hidden absolute -top-4 right-24 text-sm  bg-gray-500 text-white rounded-md p-1">
                        set initial response
                      </p>
                      <InitialResponseLabel
                        id={response._id}
                        setIsLoading={setIsLoading}
                        originalValue={response.initialResponse}
                      />
                    </div>

                    <PencilSquareIcon
                      className="w-6 h-6 text-green-500 cursor-pointer hover:text-green-400"
                      onClick={() => handleEditResponse(response._id)}
                    />
                  </>
                )}

              <TrashIcon
                className="w-6 h-6 text-red-500 cursor-pointer hover:text-red-400 "
                onClick={() => {
                  const confirmation = window.confirm(
                    `Are you sure to delete Response`
                  );
                  if (confirmation) {
                    handleDeleteResponse(response._id);
                  }
                }}
              />
            </>
          ) : (
            <>
              <div className="group">
                <p className="group-hover:block hidden absolute -top-4 text-sm right-9 bg-gray-500 text-white rounded-md p-1">
                  example
                </p>
                <RectangleStackIcon className="w-6 h-6 text-gray-500 cursor-pointer" />
              </div>
            </>
          )}
          {response.multipleRes == false && (
            <div className="group">
              <p className="group-hover:block hidden absolute -top-4 text-sm right-2 bg-gray-500 text-white rounded-md p-1">
                switch
              </p>
              <input
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault01"
                onChange={(e) => setShowTab(e.target.checked)}
              />
            </div>
          )}
        </div>
      </div>
      {response.multipleRes == false && (
        <div
          className={`${
            response?.attachmentFile &&
            showTab &&
            "flex gap-2 place-items-center"
          } ${
            !response?.suggestedTrigger &&
            showTab &&
            "grid place-items-center p-4"
          }`}
        >
          {!showTab ? (
            <>
              <ul className="pl-6 py-2 flex flex-wrap gap-1">
                {response?.triggerText?.map((text, idx) => (
                  <li className="bg-blue-100 py-1 px-2 rounded-md " key={idx}>
                    {text}
                  </li>
                ))}
              </ul>
              <div className="flex items-center space-x-2">
                <ArrowUturnLeftIcon className="w-6 h-6 text-blue-500 rotate-180" />
                <div className="font-bold text-lg">Response:</div>
              </div>
              <p className="bg-gray-100 p-3 rounded-md shadow-md">
                {response.responseMsg}
              </p>
              <div className="flex items-center justify-center gap-1 flex-wrap mt-2 mb-0">
                {response &&
                  response?.urlLabels?.map((elem, index) => (
                    <div
                      onClick={() => {
                        window.location.href = elem.link;
                      }}
                      key={index}
                      title={elem.link}
                      className="text-sm text-blue-500 hover:text-blue-700 underline cursor-pointer text-center flex gap-1 items-center justify-center rounded-md px-2  border border-blue-500"
                    >
                      <p className="">{elem.label}</p>
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <>
              {response?.suggestedTrigger?.length > 0 ? (
                <div className="w-full mt-2">
                  <ul className="pl-6 py-2 flex flex-col gap-1">
                    {response?.suggestedTrigger?.map((text, idx) => (
                      <li
                        className="bg-blue-100 py-1 px-2 rounded-md "
                        key={idx}
                      >
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex gap-1">
                  <LightBulbIcon className="w-5 h-5" />
                  <p>No Suggestions</p>
                </div>
              )}
              <div className="rounded-sm shadow-lg overflow-hidden w-full max-w-20 mt-2">
                {response?.attachmentFile ? (
                  <img
                    width={200}
                    height={100}
                    alt={response.responseMsg}
                    src={response.attachmentFile}
                    className="w-auto h-auto"
                  />
                ) : (
                  <div className="flex gap-1">
                    <PhotoIcon className="w-5 h-5" />
                    <p>No Attachment</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
      {response.multipleRes == true && (
        <div className="">
          <ul className="pl-6 py-2 flex flex-wrap gap-1">
            {response?.triggerText?.map((text, idx) => (
              <li className="bg-blue-100 py-1 px-2 rounded-md " key={idx}>
                {text}
              </li>
            ))}
          </ul>
          <div className="p-4">
            <SliderForPreviewMulRes data={response?.responsesData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewCard;
