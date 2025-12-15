import { useLiveChatData } from "@/context/livechatContext";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { toast } from "react-toastify";
import { useSocket } from "@/context/SocketContext";
import FileUploaderLiveChat from "@/components/Inbox/chats/FileUploaderLiveChat";
import { useMALiveChatData } from "@/context/MALiveChatContext";
import { useMasterAdminSocket } from "@/context/SocketMasterAdminContext";
const PaperClipIcon = dynamic(
  import("@heroicons/react/24/outline/PaperClipIcon")
);
const FaceSmileIcon = dynamic(
  import("@heroicons/react/24/outline/FaceSmileIcon")
);
const PaperAirplaneIcon = dynamic(
  import("@heroicons/react/24/solid/PaperAirplaneIcon")
);
const MasterAdminInboxForm = ({ activeChat, msgsData, setMsgsData }) => {
  const { socketMA } = useMasterAdminSocket();

  const { joinedChatAssistantMA } = useMALiveChatData();
  const [showEmojis, setShowEmojis] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const addEomoji = (e) => {
    setTextMessage(`${textMessage + e.native}`);
  };

  const addMsg = (TextMsgdata) => {
    const msgNew = {
      myself: true,
      message: textMessage,
      attachmentFile: selectedFile,
      type: "livechat",
      assiMsgData: joinedChatAssistantMA,
    };

    !selectedFile &&
      socketMA.current.emit("sendMsg", {
        from: joinedChatAssistantMA?._id ? joinedChatAssistantMA?._id : "",
        to: activeChat?.status == true ? activeChat?._id : "",
        message: textMessage,
        attachmentFile: "",
        type: "livechat",
        assiMsgData: joinedChatAssistantMA,
      });

    const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/live/addmsg`;
    fetch(API_PATH, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: TextMsgdata,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status == "success") {
          // toast.success(data.message);
          // console.log("msg data", data);
          if (selectedFile) {
            socketMA.current.emit("sendMsg", {
              from: joinedChatAssistantMA?._id
                ? joinedChatAssistantMA?._id
                : "",
              to: activeChat?.status == true ? activeChat?._id : "",
              message: textMessage,
              attachmentFile: data?.newMessage?.attachmentFile,
              type: "livechat",
              assiMsgData: joinedChatAssistantMA,
            });
            setMsgsData(
              msgsData.concat({
                myself: true,
                message: textMessage,
                attachmentFile: data?.newMessage?.attachmentFile,
                type: "livechat",
                assiMsgData: joinedChatAssistantMA,
              })
            );
          }
        } else {
          toast.error(data.message);
        }
      })
      .catch((e) => {
        console.error(e);
      });

    !selectedFile && setMsgsData(msgsData.concat(msgNew));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (joinedChatAssistantMA?._id == undefined) {
      toast.warn("Assistant Not joined!");
    } else {
      // const payload = {
      //   from: joinedChatAssistantMA?._id ? joinedChatAssistantMA?._id : "",
      //   to: activeChat?.status == true ? activeChat?._id : "",
      //   message: textMessage,
      // };
      const msgToSend = new FormData();
      selectedFile && msgToSend.append("attachmentFile", selectedFile);
      joinedChatAssistantMA?._id &&
        msgToSend.append("from", joinedChatAssistantMA?._id);
      activeChat?.status == true && msgToSend.append("to", activeChat?._id);
      textMessage && msgToSend.append("message", textMessage);
      textMessage && msgToSend.append("type", "livechat");
      textMessage &&
        msgToSend.append("assiMsgData", JSON.stringify(joinedChatAssistantMA));

      // console.log("msgToSend", Object.fromEntries(msgToSend));
      addMsg(msgToSend);
      setTextMessage("");
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    console.log("file", file);
    setSelectedFile(file);
    // Reset the file input value to allow re-selection of the same file
    event.target.value = null; // Reset the input
  };

  // useEffect(() => {
  //   console.log("selectedFile", selectedFile);
  // }, [selectedFile]);

  return (
    <div className="w-full relative">
      {selectedFile != null && (
        <FileUploaderLiveChat
          handleSubmit={handleSubmit}
          setTextMessage={setTextMessage}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
          <div>
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="fileInput"
              accept="/*" // Specify accepted file types here
            />

            {/* Button to trigger file input */}
            <label
              htmlFor="fileInput"
              className="flex items-center justify-center text-gray-500 hover:text-gray-600 cursor-pointer"
            >
              <PaperClipIcon className="w-6 h-6" />
            </label>
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
    </div>
  );
};

export default MasterAdminInboxForm;
