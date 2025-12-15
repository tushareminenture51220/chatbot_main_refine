import Chatbox from "@/components/Inbox/Chatbox";
import Info from "@/components/Inbox/Info";
import Users from "@/components/Inbox/Users";
import ChatsSkeleton from "@/components/Loders/ChatsSkeleton";
import InfoSkeleton from "@/components/Loders/InfoSkeleton";
import { useAuth } from "@/context/AuthContext";
import { useLiveChatData } from "@/context/livechatContext";
import React, { useEffect } from "react";

const Inbox = () => {
  const {
    users,
    joinedChatAssistant,
    setJoinedChatAssistant,
    getLiveChatUsers,
    activeChat,
    setActiveChat,
    isLoading,
  } = useLiveChatData();
  const { authJWTToken, userId } = useAuth();

  useEffect(() => {
    if (userId && authJWTToken) getLiveChatUsers(authJWTToken, userId);
  }, [joinedChatAssistant?._id, userId, authJWTToken]);

  useEffect(() => {
    if (activeChat?.status == false && users?.length > 0) {
      const user = users.find((user) => user.deletedStatus == true);
      if (user) {
        setActiveChat({ status: true, data: user });
      }
    }
  }, [users?.length, activeChat?.status]);

  return (
    <>
      <div className="flex h-[80vh] w-full items-start justify-center">
        <div className="w-1/4 h-full p-0 m-0 border-r">
          <Users users={users} isLoading={isLoading} />
        </div>
        <div className="w-2/4 h-full">
          {users?.length > 0 ? (
            <Chatbox joinedChatAssistant={joinedChatAssistant} />
          ) : (
            <ChatsSkeleton />
          )}
        </div>
        <div className="w-1/4 border-l h-full">
          {users?.length > 0 ? (
            <Info
              joinedChatAssistant={joinedChatAssistant}
              setJoinedChatAssistant={setJoinedChatAssistant}
            />
          ) : (
            <InfoSkeleton />
          )}
        </div>
      </div>
    </>
  );
};

export default Inbox;
