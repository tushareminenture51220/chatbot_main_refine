import React from "react";
import UserNameEmailAvatar from "../miniComponants/UserNameEmailAvatar";
import dynamic from "next/dynamic";
import ChatsAndForm from "./ChatsAndForm";
import { useLiveChatData } from "@/context/livechatContext";
import DropDownChatsMenu from "./DropDownChatsMenu";

const MagnifyingGlassIcon = dynamic(
  import("@heroicons/react/24/solid/MagnifyingGlassIcon")
);

const Chatbox = () => {
  const { activeChat } = useLiveChatData();

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div className="px-4 py-0 h-fit flex justify-between">
          <div>
            {activeChat?.status == true && (
              <UserNameEmailAvatar
                letter={activeChat?.data?.userName[0]}
                userName={activeChat?.data?.userName}
                userEmail={"online"}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <MagnifyingGlassIcon className="w-6 h-6 cursor-pointer text-gray-700" />
            <DropDownChatsMenu activeChat={activeChat} />
          </div>
        </div>
        <hr className="mt-1" />

        <div className="flex-grow-1 h-full">
          {activeChat?.status && <ChatsAndForm />}
        </div>
      </div>
    </>
  );
};

export default Chatbox;
