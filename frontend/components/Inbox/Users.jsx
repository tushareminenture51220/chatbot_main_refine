import React, { useEffect } from "react";
import UserNameEmailAvatar from "../miniComponants/UserNameEmailAvatar";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import EnvelopeOpenIcon from "@heroicons/react/24/solid/EnvelopeOpenIcon";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import InlineLoader from "../Loders/InlineLoader";
import { useLiveChatData } from "@/context/livechatContext";
import TimeAgo from "../TimeAgo";

const Users = ({ users, isLoading }) => {
  const { setActiveChat } = useLiveChatData();

  return (
    <>
      <div className="flex justify-start items-start gap-2 px-4 pt-3">
        <EnvelopeOpenIcon className="w-6 h-7 text-blue-500" />
        <span className="text-lg font-semibold">Inbox</span>
      </div>
      <hr className="mt-3" />

      <div className="overflow-y-auto h-[70vh]">
        {isLoading ? (
          <InlineLoader msg={"fetching users.."} />
        ) : users?.length > 0 ? (
          users?.map(
            (elem) =>
              elem?.deletedStatus == true && (
                <div
                  key={elem._id}
                  className="flex flex-col items-start justify-start w-full m-0 p-0 "
                >
                  <div className="group w-full flex items-start justify-between px-2 py-3 hover:bg-blue-100">
                    <div
                      className="cursor-pointer w-[80%]"
                      onClick={() =>
                        setActiveChat({ status: true, data: elem })
                      }
                    >
                      <UserNameEmailAvatar
                        letter={elem?.userName[0]}
                        userName={elem?.userName}
                        userEmail={elem?.userEmail}
                      />
                    </div>
                    <div className="w-[20%] pt-1 cursor-pointer flex flex-col items-center justify-between h-full gap-0">
                      <span className="text-[11px] mb-1 text-gray-700 font-semibold">
                        <TimeAgo timestamp={elem?.updatedAt} />
                      </span>
                    </div>
                  </div>
                </div>
              )
          )
        ) : (
          <div className="bg-blue-100 border-t-4 border-blue-500 text-blue-700 p-4 mb-4 flex gap-2 justify-start items-center">
            <div>
              <UserGroupIcon className="w-7 h-7 animate-pulse" />
            </div>
            <span>No users found</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
