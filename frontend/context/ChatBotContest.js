import React, { createContext, useContext, useEffect, useState } from "react";
import thumbnail from "../images/eminenture-thumbnail.webp";
// Chat context
const ChatBotContest = createContext();

//custom hook to access the chat state
export function useChatBotData() {
  return useContext(ChatBotContest);
}

// ChatDataProvider component
export function ChatBotDataProvider({ children }) {
  const [botData, setBotData] = useState([]);
  const [scriptVisible, setScriptVisible] = useState(false);

  const getChatBotData = async (token) => {
    fetch(`${process.env.NEXT_PUBLIC_EMBOT_API}/chatbot/get-data`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.messgae == "Unauthorized user") {
          localStorage.clear();
          alert("session time out please login again!");
          window.location.href = "/login";
        } else {
          setBotData(res.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Checking here the token's expiration when the app loads
  useEffect(() => {
    const token = localStorage.getItem("EM_Token");
    if (botData?.length == 0) {
      setBotData([
        {
          _id: 1,
          responseMsg: "Hello 👋 how can i assist you?",
          attachmentFile: thumbnail,
          suggestedTrigger: [
            "Tell me about your services?",
            "Tell me about your comapany?",
            "What do you offer?",
          ],
          triggerText: [
            "Hi",
            "Hello",
            "hi there",
            "hey",
            "hey there",
            "Can you assist me?",
          ],
          commonData: true,
        },
      ]);
    }
  }, [botData]);

  return (
    <ChatBotContest.Provider value={{ botData, getChatBotData }}>
      {children}
    </ChatBotContest.Provider>
  );
}
