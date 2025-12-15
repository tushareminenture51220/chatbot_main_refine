import React, { useEffect, useState } from "react";
import {
  InformationCircleIcon,
  UserCircleIcon,
  EnvelopeIcon,
  SignalIcon,
  CalendarDaysIcon,
  ComputerDesktopIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import ReactCountryFlag from "react-country-flag";

const UserInfoPopup = ({ activeUserInfoPopup, setActiveUserInfoPopup }) => {
  const [lastViewedPageData, setLastViewedPageData] = useState("");
  function formatDateTime(dateString) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const formattedDateTime = new Date(dateString).toLocaleString(
      "en-US",
      options
    );
    return formattedDateTime;
  }
  useEffect(() => {
    if (activeUserInfoPopup?.createdAt) {
      const formattedDate = formatDateTime(activeUserInfoPopup?.createdAt);
      setLastViewedPageData((prevData) => {
        const formattedDate = formatDateTime(activeUserInfoPopup?.createdAt);
        // Only update if the value has changed
        if (formattedDate !== prevData) {
          return formattedDate;
        }
        return prevData;
      });
    }
    // console.log(lastViewedPageData);
  }, [activeUserInfoPopup?.createdAt]);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-900 opacity-50 absolute inset-0"></div>

      <div className="bg-white w-[90%] max-w-lg rounded-lg shadow-lg z-10 p-4 relative">
        <div className="flex justify-between items-center gap-2 px-4 pt-3">
          <div className="flex items-center justify-start gap-2">
            <InformationCircleIcon className="w-6 h-7 text-blue-500" />
            <h5 className="text-lg font-semibold">User Info</h5>
          </div>
          <button
            className="float-right"
            title="Close"
            onClick={() => setActiveUserInfoPopup(false)}
            aria-label="Close chat"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        <hr className="mt-3" />
        {activeUserInfoPopup?.userName ? (
          <>
            <div className="bg-white w-[85%] my-2 rounded-md mx-auto px-4 py-4 shadow-sm flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center justify-start gap-4 text-gray-600">
                <div className="w-5">
                  <UserCircleIcon className="w-5 h-5" />
                </div>
                <h5 className="text-md font-semibold flex-grow">
                  {activeUserInfoPopup?.userName}
                </h5>
              </div>
              <div className="flex items-center justify-start gap-4 text-gray-600">
                <div className="w-5">
                  <EnvelopeIcon className="w-5 h-5" />
                </div>
                <h5 className="text-md font-semibold truncate">
                  {activeUserInfoPopup?.userEmail}
                </h5>
              </div>
              <div className="flex items-center justify-start gap-4 text-gray-600">
                <div className="w-5">
                  <ReactCountryFlag
                    countryCode={activeUserInfoPopup?.location?.country_code}
                    svg
                    style={{ width: "1.5em", height: "1.5em" }}
                    title={activeUserInfoPopup?.location?.country_code}
                  />
                </div>
                <h5
                  title="click to see location"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/${activeUserInfoPopup?.location?.city}, ${activeUserInfoPopup?.location?.region}`,
                      "_blank"
                    )
                  }
                  className="flex-grow truncate text-sm cursor-pointer text-blue-500 font-semibold whitespace-nowrap overflow-ellipsis"
                >{`${activeUserInfoPopup?.location?.city}, ${activeUserInfoPopup?.location?.region}`}</h5>
              </div>
              <div className="flex items-center justify-start gap-4 text-gray-600">
                <div className="w-5">
                  <SignalIcon className="w-5 h-5" />
                </div>
                <h5
                  title="IP Address"
                  className="text-sm truncate font-semibold whitespace-nowrap overflow-ellipsis flex-grow"
                >{`${activeUserInfoPopup?.location?.ip}`}</h5>
              </div>
            </div>
            <div className="bg-white w-[85%] my-2 rounded-md mx-auto px-4 py-4 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-start gap-4 text-gray-600">
                <CalendarDaysIcon className="w-5 h-5" />
                <div className="flex-grow">
                  <div className="text-md font-semibold truncate">
                    Last viewed page
                  </div>
                  <div className="text-[11px] text-gray-500 font-normal truncate">
                    {lastViewedPageData}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-start gap-4 text-gray-600">
                <div className="w-5">
                  <ComputerDesktopIcon className="w-5 h-5" />
                </div>
                <h5
                  title="viewed page"
                  className="flex-grow text-sm cursor-pointer text-blue-500 font-semibold whitespace-nowrap overflow-ellipsis"
                >{`${
                  activeUserInfoPopup?.visitedPage?.split("/").pop().length > 0
                    ? activeUserInfoPopup?.visitedPage?.split("/").pop()
                    : "Homepage"
                }`}</h5>
              </div>
              {activeUserInfoPopup?.joinedExecutive?.status === true && (
                <div className="flex items-center justify-start gap-4 text-gray-600">
                  <div className="w-5">
                    <InformationCircleIcon className="w-5 h-5" />
                  </div>
                  <p
                    title="viewed page"
                    className="flex-grow text-sm cursor-pointer whitespace-nowrap overflow-ellipsis"
                  >
                    If user terminates live chat,
                    <br /> please log out to rejoin
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-blue-100 border-t-4 border-blue-500 text-blue-700 p-4 mb-4 flex gap-2 justify-start items-center">
            <span>No Data found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoPopup;
