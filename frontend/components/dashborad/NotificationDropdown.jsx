import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import UserNameEmailAvatar from "../miniComponants/UserNameEmailAvatar";
import TimeAgo from "../TimeAgo";
import useSound from "use-sound";
const BellAlertIcon = dynamic(
  import("@heroicons/react/24/solid/BellAlertIcon")
);
import notificationSoundRing from "@/ringtones/notificationringtone.mp3";
import notificationSoundBeep from "@/ringtones/beepringtone.mp3";
import { useRouter } from "next/router";
import { useSocket } from "@/context/SocketContext";
import { useLiveChatData } from "@/context/livechatContext";
function NotificationDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAllNotification, setShowAllNotification] = useState(false);
  // const socket = useRef();

  const { socket } = useSocket();
  const [notificationsData, setNotificationsData] = useState([]);
  const { userId, authJWTToken } = useAuth();
  const { getLiveChatUsers } = useLiveChatData();
  const [play, { stop, sound }] = useSound(notificationSoundRing, {
    loop: true,
  });
  const [playBeep] = useSound(notificationSoundBeep, {
    loop: false,
  });
  const router = useRouter();
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getNotificationsData = async () => {
    try {
      const API_URL = `${process.env.NEXT_PUBLIC_EMBOT_API}/notify/get-notifications/${userId}`;
      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authJWTToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      if (data.status === "success") {
        setNotificationsData(data.data);
      } else {
        console.error("API returned an error:", data.message);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error.message);
    }
  };

  const updateNotificationStatus = async (id) => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/notify/update-notification/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authJWTToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      let data = await res.json();

      if (data) {
        stop();
      }
      router.push(`/auth/dashboard/inbox`);
      getNotificationsData();
      // console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const updateUserDeleteStatus = async (id, status) => {
    try {
      // Convert the boolean status to a string 'true' or 'false'
      const statusString = status ? "true" : "false";

      // Send PATCH request to update the user's delete status
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/live/changeUserDeleteStatus/${id}/${status}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user status");
      }

      // Parse the response JSON
      const data = await response.json();
      // console.log("User status updated successfully:", data);
      if (data) {
        getLiveChatUsers(authJWTToken, userId);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      // Handle error as needed
      return { status: "error", message: error.message };
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("newNotification", (notifyData) => {
        //   console.log("notifyData", notifyData);
        if (notifyData) {
          notifyData?.userInfo?.type == "seekingAssistant"
            ? play()
            : playBeep();
          setDropdownOpen(true);
          setNotificationsData((prev) => [...prev, notifyData]);

          updateUserDeleteStatus(notifyData?.userInfo?._id, true);
        }
      });

      socket.current.on("stopNotificationRing", () => {
        stop();
        setDropdownOpen(false);
      });
    }
    return () => socket.current.off();
  }, [notificationsData, socket]);

  useEffect(() => {
    if (authJWTToken && userId) {
      getNotificationsData();
    }
  }, [authJWTToken, userId]);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`p-2 rounded-full bg-white focus:outline-none hover:bg-gray-50 ${
          dropdownOpen && "bg-orange-100"
        }`}
      >
        {/* <BellIcon className="h-6 w-6 text-gray-800" /> */}
        <BellAlertIcon className="h-6 w-6 text-gray-800" />
      </button>

      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-800 opacity-50"
          onClick={toggleDropdown}
        ></div>
      )}

      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-50 animate-fade-down`}
          style={{ width: "20rem" }}
        >
          <div className="max-h-[26.5rem] overflow-y-auto overflow-x-hidden">
            {notificationsData?.length > 0 ? (
              notificationsData
                ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((elem, index) => (
                  <div key={index}>
                    <div
                      onClick={() => {
                        updateNotificationStatus(elem._id);
                        setDropdownOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 border-b hover:bg-gray-100 -mx-2 cursor-pointer ${
                        !elem?.seenStatus ? "bg-blue-50" : "bg-white"
                      }`}
                    >
                      <div>
                        <UserNameEmailAvatar
                          letter={elem?.userInfo?.userName[0]}
                          size={true}
                        />
                      </div>
                      <div>
                        {elem?.userInfo?.type == "seekingAssistant" ? (
                          <div>
                            <p className="text-gray-600 text-sm mx-2">
                              <span className="font-bold">
                                {elem?.userInfo?.userName}
                              </span>
                              &nbsp;from the&nbsp;
                              <span className="font-bold text-blue-500">
                                {elem?.userInfo?.visitedPage.split("/").pop()
                                  .length == 0
                                  ? "Homepage"
                                  : elem?.userInfo?.visitedPage
                                      .split("/")
                                      .pop()}
                              </span>
                              &nbsp;is seeking assistance. If available, please
                              connect promptly.&nbsp; &nbsp;
                              <span className="font-bold">
                                <TimeAgo timestamp={elem?.createdAt} />
                              </span>
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-600 text-sm mx-2">
                              <span className="font-bold">
                                {elem?.userInfo?.userName}
                              </span>
                              &nbsp;from the&nbsp;
                              <span className="font-bold text-blue-500">
                                {elem?.userInfo?.visitedPage.split("/").pop()
                                  .length == 0
                                  ? "Homepage"
                                  : elem?.userInfo?.visitedPage
                                      .split("/")
                                      .pop()}
                              </span>
                              &nbsp;is registered.&nbsp; &nbsp;
                              <span className="font-bold">
                                <TimeAgo timestamp={elem?.createdAt} />
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex items-center justify-center gap-2 p-2">
                <div className="text-center">
                  <BellAlertIcon className="w-12 h-12 text-gray-500 mx-auto animate-pulse" />
                  <p className="text-gray-600">No notifications</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <div
              onClick={() => setShowAllNotification(true)}
              className="block cursor-pointer bg-gray-800 text-white text-center font-bold py-2"
            >
              See all notifications
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
