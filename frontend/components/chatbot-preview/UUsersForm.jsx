import { useLiveChatData } from "@/context/livechatContext";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { toast } from "react-toastify";
import { useSocket } from "@/context/SocketContext";
const PaperClipIcon = dynamic(
  import("@heroicons/react/24/outline/PaperClipIcon")
);
const FaceSmileIcon = dynamic(
  import("@heroicons/react/24/outline/FaceSmileIcon")
);
const PaperAirplaneIcon = dynamic(
  import("@heroicons/react/24/solid/PaperAirplaneIcon")
);
const UUsersForm = ({ msgsData, setMsgsData, arrivalMsg, setArrivalMsg }) => {
  const { activeChat, joinedChatAssistant } = useLiveChatData();
  const [showEmojis, setShowEmojis] = useState(false);
  const { socket } = useSocket();
  const [textMessage, setTextMessage] = useState("");
  const addEomoji = (e) => {
    setTextMessage(`${textMessage + e.native}`);
  };

  const addMsg = (TextMsgdata) => {
    const msgNew = { myself: true, message: textMessage };

    socket.current.emit("sendMsg", {
      to: joinedChatAssistant?._id ? joinedChatAssistant?._id : "",
      from: activeChat?.status == true ? activeChat?.data?._id : "",
      message: textMessage,
    });

    const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/live/addmsg`;
    fetch(API_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(TextMsgdata),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status == "success") {
          // toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((e) => {
        console.error(e);
      });
    setMsgsData(msgsData.concat(msgNew));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (joinedChatAssistant?._id == undefined) {
      toast.warn("Assistant Not joined!");
    } else {
      const payload = {
        to: joinedChatAssistant?._id ? joinedChatAssistant?._id : "",
        from: activeChat?.status == true ? activeChat?.data?._id : "",
        message: textMessage,
      };
      addMsg(payload);
      setTextMessage("");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
          <div>
            <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
              <PaperClipIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <div>
                <input
                  required
                  onChange={(e) => setTextMessage(e.target.value)}
                  value={textMessage}
                  name="message"
                  type="text"
                  className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                />
              </div>
              <div>
                {showEmojis && (
                  <div
                    id="EmojiPicker"
                    className={`absolute -top-[21rem] shadow-md rounded-lg -right-[7.5rem] h-80 overflow-hidden animate-fade-up`}
                  >
                    <Picker
                      data={data}
                      emojiSize={20}
                      onEmojiSelect={addEomoji}
                      maxFrequentRows={0}
                      perLine={8}
                      previewPosition={"none"}
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                >
                  <FaceSmileIcon className="w-6 h-6 hover:bg-gray-50 hover:rounded-full" />
                </button>
              </div>
            </div>
          </div>
          <div className="ml-4">
            <button
              type="submit"
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
            >
              <span>Send</span>
              <span className="ml-2">
                <PaperAirplaneIcon className="w-4 h-4 transform -rotate-45 -mt-px" />
              </span>
            </button>
          </div>
        </div>
      </form>
      <style>{`
        #EmojiPicker em-emoji-picker {
          height: 20rem;
          max-width: fit-content;
        }
      `}</style>
    </>
  );
};

export default UUsersForm;
