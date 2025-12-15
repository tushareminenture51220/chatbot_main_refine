import React, { useEffect, useState } from "react";
import {
  ArrowLeftOnRectangleIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import FromMAChatBubble from "./FromMAChatBubble";
import UserNameEmailAvatar from "@/components/miniComponants/UserNameEmailAvatar";
import MasterAdminInboxForm from "./MasterAdminInboxForm";
import { useLiveChatData } from "@/context/livechatContext";
import MasterAdminChatsBody from "./MasterAdminChatsBody";
import { useMALiveChatData } from "@/context/MALiveChatContext";
import AssistantCheckForm from "@/components/live-users/AssistantCheckForm";
import AssistantCheckFormMasterAdmin from "../AssistantCheckFormMasterAdmin";
import { useMasterAdminAuth } from "@/context/MasterAdminAuthContext";
import { toast } from "react-toastify";
import { useMasterAdminSocket } from "@/context/SocketMasterAdminContext";
import { useMasterAdminCommonData } from "@/context/MasterAdminCommonData";

const MAChatWindow = ({ user, onClose, setActiveUserInfoPopup }) => {
  const [msgsData, setMsgsData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { joinedChatAssistantMA, setJoinedChatAssistantMA } =
    useMALiveChatData();
  const [showFormUser, setShowFormUser] = useState({});
  const { userIdMA, maJWTToken } = useMasterAdminAuth();
  const [menuDropDown, setMenuDropDown] = useState(false);

  const { setActiveCWUsers, getAllAccountsUsersData, prasentAccounts } =
    useMasterAdminCommonData();

  const { socketMA } = useMasterAdminSocket();
  //  console.log("joinedChatAssistantMA", joinedChatAssistantMA);

  const deleteUserMsgs = (userId) => {
    fetch(
      `${process.env.NEXT_PUBLIC_EMBOT_API}/live/deleteAllMessages/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((response) => {
        toast.success(response.message);
        window.location.reload();
      })
      .catch((error) => console.error("Error deleting messages:", error));
  };
  function chatTranscriptFunc() {
    fetch(`${process.env.NEXT_PUBLIC_EMBOT_API}/live/chat-transcript`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatMessages: msgsData,
        userEmail: user?.adminEmail,
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

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const updateAssistantStatus = (payload, token) => {
    fetch(
      `${process.env.NEXT_PUBLIC_EMBOT_API}/master/check-assistant/${userIdMA}`,
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
            userId: user?._id,
            Assi_userName: joinedChatAssistantMA.userName,
            Assi_userEmail: joinedChatAssistantMA.userEmail,
            Assi_id: joinedChatAssistantMA._id,
          };
          socketMA.current.emit("AssistantLogoutChat", assiData);
          toast.success(res.message);
          chatTranscriptFunc();
          setTimeout(() => {
            setJoinedChatAssistantMA({});
            localStorage.removeItem("joinedChatAssistantMA");
            getAllAccountsUsersData(prasentAccounts);
            setActiveCWUsers((prevUsers) =>
              prevUsers.map((elem) =>
                elem._id === user._id
                  ? {
                      ...elem,
                      joinedExecutive: {
                        status: false,
                        executive: {},
                      },
                    }
                  : elem
              )
            );
          }, 500);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // useEffect(() => {
  //   console.log(msgsData, "msgsData");
  // }, [user]);

  return (
    <div className="flex h-[82vh] flex-col w-full border rounded-lg shadow-lg bg-white fade-appears ">
      {/* Header */}
      <div
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
        }}
        className="flex items-center justify-between p-4 border-b"
      >
        <div className="flex items-center">
          <UserNameEmailAvatar
            letter={user?.userName[0]}
            userName={user?.userName}
            userEmail={user?.companyWebsite}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button title="Menu" onClick={() => setMenuDropDown(!menuDropDown)}>
              <EllipsisVerticalIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
            </button>
            {menuDropDown && (
              <>
                <div className="z-10 absolute right-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                  {user?.joinedExecutive?.status == true &&
                    joinedChatAssistantMA?._id ==
                      user?.joinedExecutive?.executive?._id && (
                      <div className="px-4 py-3 text-left text-sm text-gray-900">
                        <div>{user?.joinedExecutive?.executive?.userName}</div>
                        <div className="font-medium truncate">
                          {user?.joinedExecutive?.executive?.userEmail}
                        </div>
                      </div>
                    )}
                  <ul
                    className="py-2 text-sm text-left text-gray-700 w-full"
                    aria-labelledby="dropdownInformationButton"
                  >
                    <li>
                      <button
                        onClick={() => deleteUserMsgs(user._id, maJWTToken)}
                        className="block text-left w-full px-4 py-2 hover:bg-gray-100"
                      >
                        Delete Chat
                      </button>
                    </li>
                  </ul>
                  {user?.joinedExecutive?.status == true &&
                    joinedChatAssistantMA?._id ==
                      user?.joinedExecutive?.executive?._id && (
                      <div className="py-2 w-full">
                        <button
                          onClick={() =>
                            updateAssistantStatus(
                              {
                                status: "Online",
                                email:
                                  user?.joinedExecutive?.executive?.userEmail,
                              },
                              maJWTToken
                            )
                          }
                          className="block text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Log out
                        </button>
                      </div>
                    )}
                </div>
              </>
            )}
          </div>
          <button
            title="Visitor Details"
            onClick={() => setActiveUserInfoPopup(user)}
          >
            <InformationCircleIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
          </button>
          <button title="Close" onClick={onClose} aria-label="Close chat">
            <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <MasterAdminChatsBody
          activeChat={user}
          msgsData={msgsData}
          setMsgsData={setMsgsData}
        />
      </div>

      {/* Bottom Input */}
      <div className="flex items-center p-4 border-t w-full">
        {user?.joinedExecutive?.status == false ? (
          <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
            <InformationCircleIcon className="flex-shrink-0 w-4 h-4" />
            <div className="ml-3 text-sm font-medium">
              No one has joined yet. Click to{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => {
                  setShowForm(true);
                  setShowFormUser(user);
                }}
              >
                join now!
              </button>
            </div>
          </div>
        ) : joinedChatAssistantMA?._id ==
          user?.joinedExecutive?.executive?._id ? (
          <MasterAdminInboxForm
            activeChat={user}
            msgsData={msgsData}
            setMsgsData={setMsgsData}
          />
        ) : (
          <div className="flex flex-row gap-2 items-center h-16 rounded-xl bg-white w-full px-4">
            <InformationCircleIcon className="flex-shrink-0 w-4 h-4" />
            {`${user?.joinedExecutive?.executive?.userName}  is joined`}
          </div>
        )}
      </div>
      {showForm && (
        <AssistantCheckFormMasterAdmin
          setShowForm={setShowForm}
          user={showFormUser}
        />
      )}
    </div>
  );
};

export default MAChatWindow;
