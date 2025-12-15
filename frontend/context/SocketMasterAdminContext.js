import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useMasterAdminAuth } from "./MasterAdminAuthContext";
import { useMasterAdminCommonData } from "./MasterAdminCommonData";

// Live Chat Socket context
const SocketMasterAdminContext = createContext();

// Custom hook to access the chat Socket
export function useMasterAdminSocket() {
  return useContext(SocketMasterAdminContext);
}

// SocketMasterAdminContextProvider component
export function SocketMasterAdminProvider({ children }) {
  const socketMA = useRef();
  const { prasentAccounts } = useMasterAdminCommonData();

  useEffect(() => {
    // Initialize socket connection
    socketMA.current = io(`${process.env.NEXT_PUBLIC_EMBOT_API}`, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    // Emit `adminConnect` event for each admin ID
    if (prasentAccounts && Object.keys(prasentAccounts).length > 0) {
      Object.values(prasentAccounts).forEach((adminId) => {
        socketMA.current.emit("adminConnect", adminId);
      });
    }

    // Cleanup function to disconnect socket
    // return () => {
    //   if (socketMA.current) {
    //     socketMA.current.disconnect();
    //   }
    // };
  }, [prasentAccounts]);

  return (
    <SocketMasterAdminContext.Provider
      value={{
        socketMA,
      }}
    >
      {children}
    </SocketMasterAdminContext.Provider>
  );
}
