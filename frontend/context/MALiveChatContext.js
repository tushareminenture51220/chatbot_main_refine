import React, { createContext, useContext, useEffect, useState } from "react";

const MALiveChatContext = createContext();

// Custom hook to access the Common Data of Master Admin
export function useMALiveChatData() {
  return useContext(MALiveChatContext);
}

// AuthProvider component
export function MALiveChatDataProvider({ children }) {
  const [joinedChatAssistantMA, setJoinedChatAssistantMA] = useState({});

  useEffect(() => {
    const localStorageValue = localStorage.getItem("joinedChatAssistantMA");
    if (localStorageValue) {
      setJoinedChatAssistantMA(JSON.parse(localStorageValue));
    }
  }, []);

  return (
    <MALiveChatContext.Provider
      value={{ joinedChatAssistantMA, setJoinedChatAssistantMA }}
    >
      {children}
    </MALiveChatContext.Provider>
  );
}
