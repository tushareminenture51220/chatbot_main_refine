import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import UserNameEmailAvatar from "../miniComponants/UserNameEmailAvatar";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useLiveChatData } from "@/context/livechatContext";
import { io } from "socket.io-client";
import ReactCountryFlag from "react-country-flag";
import { useSocket } from "@/context/SocketContext";

const InformationCircleIcon = dynamic(
  import("@heroicons/react/24/solid/InformationCircleIcon")
);
const EnvelopeIcon = dynamic(import("@heroicons/react/24/solid/EnvelopeIcon"));
const MapPinIcon = dynamic(import("@heroicons/react/24/solid/MapPinIcon"));
const SignalIcon = dynamic(import("@heroicons/react/24/solid/SignalIcon"));
const ComputerDesktopIcon = dynamic(
  import("@heroicons/react/24/solid/ComputerDesktopIcon")
);
const UserCircleIcon = dynamic(
  import("@heroicons/react/24/solid/UserCircleIcon")
);
const ArrowLeftOnRectangleIcon = dynamic(
  import("@heroicons/react/24/solid/ArrowLeftOnRectangleIcon")
);
const CalendarDaysIcon = dynamic(
  import("@heroicons/react/24/solid/CalendarDaysIcon")
);
const UserIcon = dynamic(import("@heroicons/react/24/solid/UserIcon"));

const Info = ({ data, joinedChatAssistant, setJoinedChatAssistant }) => {
  const { authJWTToken, userId, user } = useAuth();

  const [lastViewedPageData, setLastViewedPageData] = useState("");
  const { activeChat, setActiveChat, getLiveChatUsers, msgsData } =
    useLiveChatData();

  const router = useRouter();
  // const socket = useRef();
  const { socket } = useSocket();
  //chat transcriptIcon functions
  function chatTranscriptFunc() {
    fetch(`${process.env.NEXT_PUBLIC_EMBOT_API}/live/chat-transcript`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatMessages: msgsData,
        userEmail: user?.email,
        website: user?.website,
        companyName: user?.companyName,
      }),
    })
      .then((res) => {
        //console.log(res, "res");
        return res.json();
      })
      .then((response) => {
        console.log("chattranscript send to admin");
      })
      .catch((e) => {
        console.log(e);
      });
  }
  const updateAssistantStatus = (payload, token) => {
    fetch(
      `${process.env.NEXT_PUBLIC_EMBOT_API}/live/check-assistant/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        // console.log("handleLogout", res);
        if (res.status == "error") {
          toast.error(res.message);
        } else {
          const assiData = {
            userId: activeChat.data._id,
            Assi_userName: joinedChatAssistant.userName,
            Assi_userEmail: joinedChatAssistant.userEmail,
            Assi_id: joinedChatAssistant._id,
          };
          socket.current.emit("AssistantLogoutChat", assiData);
          setJoinedChatAssistant({});
          localStorage.removeItem("joinedChatAssistant");
          toast.success(res.message);
          chatTranscriptFunc();
          setTimeout(() => {
            getLiveChatUsers(authJWTToken, userId);
            setActiveChat({ status: false, data: {} });
          }, 500);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
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
    if (activeChat?.data?.createdAt) {
      const formattedDate = formatDateTime(activeChat?.data?.createdAt);
      setLastViewedPageData((prevData) => {
        const formattedDate = formatDateTime(activeChat?.data?.createdAt);
        // Only update if the value has changed
        if (formattedDate !== prevData) {
          return formattedDate;
        }
        return prevData;
      });
    }
    // console.log(lastViewedPageData);
  }, [activeChat?.data?.createdAt]);

  // useEffect(() => {
  //   socket.current = io(`${process.env.NEXT_PUBLIC_EMBOT_API}`);
  //   if (userId) {
  //     socket.current.emit("adminConnect", userId);
  //   }
  // }, [userId, socket]);

  useEffect(() => {
    // console.log(socket);
    socket.current.on("autoAssistantloggedOut", (data) => {
      //  console.log("admin connected for logut", data);
      updateAssistantStatus(
        {
          status: "Online",
          email: data?.joinedExecutiveEmail,
        },
        authJWTToken
      );
    });
  }, [socket]);
  return (
    <>
      <div className="">
        <div className="flex justify-start items-center gap-2 px-4 pt-3">
          <InformationCircleIcon className="w-6 h-7 text-blue-500" />
          <h5 className="text-lg font-semibold">Visitor Details </h5>
        </div>
        <hr className="mt-3" />
        {activeChat?.data?.userName ? (
          <>
            <div className="bg-white w-[85%] my-2 rounded-md mx-auto px-4 py-4 shadow-sm flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center justify-start gap-4 text-gray-600">
                <div className="w-5">
                  <UserCircleIcon className="w-5 h-5" />
                </div>
                <h5 className="text-md font-semibold flex-grow">
                  {activeChat?.data?.userName}
                </h5>
              </div>
              <div className="flex items-center justify-start gap-4 text-gray-600">
                <div className="w-5">
                  <EnvelopeIcon className="w-5 h-5" />
                </div>
                <h5 className="text-md font-semibold truncate ">
                  {activeChat?.data?.userEmail}
                </h5>
              </div>
              <div className="flex items-center justify-start gap-4 text-gray-600">
                <div className="w-5">
                  <ReactCountryFlag
                    countryCode={activeChat?.data?.location?.country_code}
                    svg
                    style={{
                      width: "1.5em",
                      height: "1.5em",
                    }}
                    title={activeChat?.data?.location?.country_code}
                  />
                </div>

                <h5
                  title="click to see location"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/${activeChat?.data?.location?.city}, ${activeChat?.data?.location?.region}`,
                      "_blank"
                    )
                  }
                  className="flex-grow truncate text-sm cursor-pointer text-blue-500 font-semibold whitespace-nowrap overflow-ellipsis"
                >
                  {`${activeChat?.data?.location?.city}, ${activeChat?.data?.location?.region}`}
                </h5>
              </div>
              <div className="flex items-center justify-start gap-4 text-gray-600">
                <div className="w-5">
                  <SignalIcon className="w-5 h-5" />
                </div>
                <h5
                  title="IP Address"
                  className="text-sm truncate font-semibold whitespace-nowrap overflow-ellipsis flex-grow"
                >{`${activeChat?.data?.location?.ip}`}</h5>
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
                  activeChat?.data?.visitedPage?.split("/").pop().length > 0
                    ? activeChat?.data?.visitedPage?.split("/").pop()
                    : "Homepage"
                }`}</h5>
              </div>
              {activeChat?.data?.joinedExecutive?.status == true && (
                <div className="flex items-center justify-start gap-4 text-gray-600">
                  <div className="w-5">
                    <InformationCircleIcon className="w-5 h-5" />
                  </div>
                  <p
                    title="viewed page"
                    className="flex-grow text-sm cursor-pointer  whitespace-nowrap overflow-ellipsis"
                  >
                    If user terminates live chat,
                    <br /> please log out to rejoin
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-start items-center gap-2 px-4 pt-3 mt-2">
              <UserIcon className="w-5 h-5 text-blue-500" />
              <h5 className="text-lg font-semibold">Joined Executive</h5>
            </div>
            <hr className="mt-3" />
            <div className="bg-white w-[85%] my-2 rounded-md mx-auto shadow-sm flex flex-col gap-4">
              {activeChat?.data?.joinedExecutive?.status == false ? (
                <div className="p-2">
                  <h6 className="text-md text-red-400 font-semibold">
                    No one joined!
                  </h6>
                </div>
              ) : (
                <>
                  <div className="my-2 mx-2 truncate">
                    <UserNameEmailAvatar
                      userEmail={
                        activeChat?.data?.joinedExecutive?.executive?.userEmail
                      }
                      letter={
                        activeChat?.data?.joinedExecutive?.executive
                          ?.userName[0]
                      }
                      userName={
                        activeChat?.data?.joinedExecutive?.executive?.userName
                      }
                      isActive={true}
                    />
                  </div>
                  {joinedChatAssistant?._id ==
                    activeChat?.data?.joinedExecutive?.executive?._id && (
                    <button
                      title="click to logout chat session"
                      onClick={() =>
                        updateAssistantStatus(
                          {
                            status: "Online",
                            email:
                              activeChat?.data?.joinedExecutive?.executive
                                ?.userEmail,
                          },
                          authJWTToken
                        )
                      }
                      className="group flex items-center justify-center text-white w-full cursor-pointer font-semibold rounded-sm mx-auto"
                    >
                      <div className="bg-gray-700 w-full h-full flex-grow px-2 py-1 text-center group-hover:bg-gray-800 transition duration-300 ease-in-out">
                        Logout
                      </div>
                      <div className="bg-gray-500 w-fit h-full px-1 py-1 text-center group-hover:bg-gray-600 transition duration-300 ease-in-out">
                        <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                      </div>
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="bg-blue-100 border-t-4 border-blue-500 text-blue-700 p-4 mb-4 flex gap-2 justify-start items-center">
            <span>No Data found</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Info;
