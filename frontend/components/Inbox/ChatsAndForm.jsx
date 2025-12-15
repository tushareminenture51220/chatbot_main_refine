import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import FromMsg from "./chats/FromMsg";
import ToMsg from "./chats/ToMsg";
import { useLiveChatData } from "@/context/livechatContext";
import ChatFromInput from "./chats/ChatFromInput";
import AssistantCheckForm from "../live-users/AssistantCheckForm";
import { useSocket } from "@/context/SocketContext";
const InformationCircleIcon = dynamic(
  import("@heroicons/react/24/solid/InformationCircleIcon")
);
const ChatsAndForm = () => {
  // const socket = useRef();
  const { socket } = useSocket();
  const {
    joinedChatAssistant,
    activeChat,
    msgsData,
    setMsgsData,
    getMessages,
  } = useLiveChatData();
  const [showForm, setShowForm] = useState(false);
  const [showFormUser, setShowFormUser] = useState({});

  const [arrivalMsg, setArrivalMsg] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    if (joinedChatAssistant?._id != undefined) {
      //  socket.current = io(`${process.env.NEXT_PUBLIC_EMBOT_API}`);
      socket.current.emit("addUser", joinedChatAssistant?._id);
    }
  }, [activeChat, joinedChatAssistant, socket]);

  useEffect(() => {
    let parametersData = {
      to: activeChat?.status == true ? activeChat?.data?._id : "",
    };
    //console.log(parametersData, "pd");
    getMessages(parametersData);
  }, [activeChat, socket]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        //   console.log(msg, "arrival msg dash");
        setArrivalMsg({ myself: false, message: msg.message });
      });
    }
  }, [activeChat, arrivalMsg, socket]);

  useEffect(() => {
    arrivalMsg && setMsgsData((prev) => [...prev, arrivalMsg]);
    // console.log("arriaval message", arrivalMsg);
  }, [arrivalMsg]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgsData]);

  return (
    <div className="flex flex-col flex-auto h-full p-6">
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
        <div
          className="flex flex-col h-full overflow-y-auto mb-4 flex-grow-1 scroll-smooth"
          ref={scrollRef}
        >
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-12 gap-y-2">
              {msgsData?.map((msg, index) =>
                msg?.myself == true ? (
                  <FromMsg
                    key={index}
                    textMsg={msg?.message}
                    attachmentFile={msg?.attachmentFile}
                    letter={
                      joinedChatAssistant?._id != undefined
                        ? joinedChatAssistant?.userName[0]
                        : "EM"
                    }
                    assiMsgData={msg?.assiMsgData}
                    responsesData={msg?.responsesData}
                  />
                ) : (
                  <ToMsg
                    key={index}
                    textMsg={msg.message}
                    letter={activeChat?.data?.userName[0]}
                    assiUnavailableFromData={
                      msg?.assiUnavailableFromData
                        ? msg?.assiUnavailableFromData
                        : null
                    }
                    customFormsData={
                      msg?.customFormsData ? msg?.customFormsData : null
                    }
                  />
                )
              )}
            </div>
          </div>
        </div>
        {activeChat?.data?.joinedExecutive?.status == false ? (
          <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
            <InformationCircleIcon className="flex-shrink-0 w-4 h-4" />
            <div className="ml-3 text-sm font-medium">
              No one has joined yet. Click to{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => {
                  setShowForm(true);
                  setShowFormUser(activeChat?.status && activeChat?.data);
                }}
              >
                join now!
              </button>
            </div>
          </div>
        ) : joinedChatAssistant?._id ==
          activeChat?.data?.joinedExecutive?.executive?._id ? (
          <ChatFromInput
            socket={socket}
            arrivalMsg={arrivalMsg}
            setArrivalMsg={setArrivalMsg}
            msgsData={msgsData}
            setMsgsData={setMsgsData}
          />
        ) : (
          <div className="flex flex-row gap-2 items-center h-16 rounded-xl bg-white w-full px-4">
            <InformationCircleIcon className="flex-shrink-0 w-4 h-4" />
            {`${activeChat?.data?.joinedExecutive?.executive?.userName}  is joined`}
          </div>
        )}
      </div>
      {showForm && (
        <AssistantCheckForm setShowForm={setShowForm} user={showFormUser} />
      )}
    </div>
  );
};

export default ChatsAndForm;
