import React from "react";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import InlineLoader from "@/components/Loders/InlineLoader";
import UserNameEmailAvatar from "@/components/miniComponants/UserNameEmailAvatar";
import TimeAgo from "@/components/TimeAgo";
import { useRouter } from "next/router";
import ReactCountryFlag from "react-country-flag";

const UsersStatMAAssitatnt = ({ users, isLoading, label, assistantsSide }) => {
  // console.log("users assistantsMA", users);
  const router = useRouter();
  return (
    <div className="flex flex-col max-w-lg overflow-x-hidden shadow-lg w-full border bg-white overflow-y-auto h-[440px]">
      <div className="flex justify-start items-start gap-2 px-4 pt-3 w-full">
        <UserGroupIcon className="w-6 h-7 text-blue-500" />
        <span className="text-lg font-semibold">
          {label} {`(${users.length})`}
        </span>
      </div>
      <hr className="mt-3" />

      <div className="overflow-y-auto">
        {users?.length > 0 ? (
          users?.map((elem) => (
            <div
              key={elem._id}
              className="flex flex-col items-start justify-start w-full m-0 p-0"
            >
              <div className="group w-full flex items-start justify-between px-2 py-3 hover:bg-blue-100">
                <div
                  className="cursor-pointer w-[80%]"
                  onClick={() => router.push("/auth/dashboard/inbox")}
                >
                  <UserNameEmailAvatar
                    letter={elem?.userName[0]}
                    userName={elem?.userName}
                    userEmail={elem?.userEmail}
                    assistantImage={elem?.assistantImage}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-blue-100 border-t-4 border-blue-500 text-blue-700 p-4 mb-4 flex gap-2 justify-start items-center">
            <div>
              <UserGroupIcon className="w-7 h-7 animate-pulse" />
            </div>
            <span>No users found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersStatMAAssitatnt;
