import FromMsg from "@/components/Inbox/chats/FromMsg";
import ToMsg from "@/components/Inbox/chats/ToMsg";
import { useLiveChatData } from "@/context/livechatContext";
import { useMALiveChatData } from "@/context/MALiveChatContext";
import { useMasterAdminCommonData } from "@/context/MasterAdminCommonData";
import { useSocket } from "@/context/SocketContext";
import { useMasterAdminSocket } from "@/context/SocketMasterAdminContext";
import React, { useEffect, useRef, useState } from "react";

const MasterAdminChatsBody = ({ activeChat, msgsData, setMsgsData }) => {
  const { socketMA } = useMasterAdminSocket();
  const scrollRef = useRef();
  const [arrivalMsg, setArrivalMsg] = useState(null);
  const { joinedChatAssistantMA } = useMALiveChatData();
  const { activeCWUsers } = useMasterAdminCommonData();

  const getMessages = (parametersData) => {
    const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/live/getmsg`;
    fetch(API_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parametersData),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status == "success") {
          // console.log("          setMsgsData(data.projectMessages);", data);
          setMsgsData(data.projectMessages);
        } else {
          console.log("error form backend");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };
  useEffect(() => {
    let parametersData = {
      to: activeChat?._id ? activeChat?._id : "",
    };
    // console.log("parametersData ms", parametersData);
    //console.log(parametersData, "pd");
    getMessages(parametersData);
  }, [activeCWUsers, activeChat, socketMA]);

  useEffect(() => {
    if (socketMA.current) {
      socketMA.current.on("msg-receive", (msg) => {
        console.log("Received new message:", msg);
        setArrivalMsg({ myself: false, message: msg.message });
      });
    }
    return () => {
      // Cleanup event listener to avoid duplicate event triggers
      socketMA.current?.off("msg-receive");
    };
  }, [socketMA, activeChat, activeCWUsers]);

  useEffect(() => {
    // console.log("arrivalMsg", arrivalMsg);
    arrivalMsg && setMsgsData((prev) => [...prev, arrivalMsg]);
  }, [arrivalMsg]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    //console.log("msgsData", msgsData);
  }, [msgsData]);

  return (
    <div className="flex flex-col flex-auto w-full h-full p-6">
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
        <div
          className="flex flex-col w-full h-full overflow-y-auto mb-4 flex-grow-1 scroll-smooth"
          ref={scrollRef}
        >
          <div className="flex flex-col h-full w-full">
            <div className="grid grid-cols-12 gap-y-2">
              {msgsData?.map((msg, index) =>
                msg?.myself == true ? (
                  <FromMsg
                    key={index}
                    textMsg={msg?.message}
                    attachmentFile={msg?.attachmentFile}
                    letter={
                      joinedChatAssistantMA?._id != undefined
                        ? joinedChatAssistantMA?.userName[0]
                        : "EM"
                    }
                    assiMsgData={msg?.assiMsgData}
                    responsesData={msg?.responsesData}
                  />
                ) : (
                  <ToMsg
                    key={index}
                    textMsg={msg.message}
                    letter={activeChat?.userName[0]}
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
      </div>
    </div>
  );
};

export default MasterAdminChatsBody;
