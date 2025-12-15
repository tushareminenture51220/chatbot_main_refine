import { act, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useLiveChatData } from "@/context/livechatContext";
const EllipsisVerticalIcon = dynamic(
  import("@heroicons/react/24/solid/EllipsisVerticalIcon")
);

const DropDownChatsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authJWTToken, userId } = useAuth();
  const { activeChat, setActiveChat, getLiveChatUsers } = useLiveChatData();

  //console.log(activeChat);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const deleteUserMsgs = (userId, authJWTToken) => {
    fetch(
      `${process.env.NEXT_PUBLIC_EMBOT_API}/live/deleteAllMessages/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authJWTToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((response) => {
        toast.success(response.message);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => console.error("Error deleting messages:", error));
  };

  return (
    <div className="relative inline-block text-left">
      <button
        id="dropdownMenuIconButton"
        onClick={toggleDropdown}
        className="inline-flex items-center p-2"
        type="button"
      >
        <EllipsisVerticalIcon className="w-6 h-6 cursor-pointer text-gray-700" />
      </button>

      {isOpen && (
        <div
          id="dropdownDots"
          className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute"
        >
          <ul
            className="py-2 text-sm text-gray-700"
            aria-labelledby="dropdownMenuIconButton"
          >
            <li
              className="cursor-pointer"
              onClick={() => {
                const confirmed = window.confirm(
                  "Are you sure you want to delete these messages?"
                );
                if (confirmed) {
                  deleteUserMsgs(activeChat?.data?._id, authJWTToken);
                }
              }}
            >
              <span className="block px-4 py-2 cursor-pointer hover:bg-gray-100">
                Delete Chat
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDownChatsMenu;
