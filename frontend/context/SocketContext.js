import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
// Live Chat Socket context
const SocketContest = createContext();

//custom hook to access the chat Socket
export function useSocket() {
  return useContext(SocketContest);
}
// const { userId, authJWTToken } = useAuth();
// SocketProvider component
export function SocketProvider({ children }) {
  const socket = useRef();
  const { userId } = useAuth();
  useEffect(() => {
    socket.current = io(`${process.env.NEXT_PUBLIC_EMBOT_API}`, {
      reconnection: true, // Enable reconnection
      reconnectionAttempts: Infinity, // Maximum number of reconnection attempts
      reconnectionDelay: 1000, // Time delay in milliseconds between reconnection attempts
      reconnectionDelayMax: 5000, // Maximum time delay in milliseconds between reconnection attempts
      randomizationFactor: 0.5, // Randomization factor for reconnection delay
    });
    // Connect as admin
    if (userId) {
      socket.current.emit("adminConnect", userId);
    }
    // return () => {
    //   socket.current.disconnect();
    // };
  }, [userId, socket]);

  return (
    <SocketContest.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContest.Provider>
  );
}
