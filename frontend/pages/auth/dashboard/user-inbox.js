import { useSocket } from "@/context/SocketContext";
import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
const UserInbox = () => {
  // const socket = useRef();
  const { socket } = useSocket();
  // useEffect(() => {
  //   socket.current = io(`${process.env.NEXT_PUBLIC_EMBOT_API}`);
  // }, []);

  return (
    <div className="flex flex-col justify-between h-full">
      User Inbox
      <div>
        <button
          className="bg-blue-500"
          onClick={() => {
            socket.current.emit("trackPerformance", {
              keyword: "Total_Unique_Users",
            });
          }}
        >
          Add Unique Users
        </button>
      </div>
    </div>
  );
};

export default UserInbox;
