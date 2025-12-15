import React, { useEffect } from "react";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import InlineLoader from "@/components/Loders/InlineLoader";
import UserNameEmailAvatar from "@/components/miniComponants/UserNameEmailAvatar";
import TimeAgo from "@/components/TimeAgo";
import { useRouter } from "next/router";
import ReactCountryFlag from "react-country-flag";

const UsersStat = ({ users, isLoading, label, assistantsSide, source }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col max-w-lg overflow-x-hidden shadow-lg w-full border bg-white overflow-y-auto h-[440px]">
      <div className="flex justify-start items-start gap-2 px-4 pt-3 w-full">
        <UserGroupIcon className="w-6 h-7 text-blue-500" />
        <span className="text-lg font-semibold">{label}</span>
      </div>
      <hr className="mt-3" />

      <div className="overflow-y-auto">
        {isLoading ? (
          <InlineLoader msg={"fetching users.."} />
        ) : users?.length > 0 ? (
          users?.map((elem) => {
            // Check if it's users and their deletedStatus is true
            if (!assistantsSide && elem?.deletedStatus === true) {
              return null; // Skip rendering if deletedStatus is true for users
            }

            // Continue rendering for all other cases
            return (
              <div
                key={elem._id}
                className="flex flex-col items-start justify-start w-full m-0 p-0"
              >
                <div className="group w-full flex items-start justify-between px-2 py-3 hover:bg-blue-100">
                  <div
                    className="cursor-pointer w-[80%]"
                    onClick={() =>
                      source === "masterAdmin"
                        ? router.push(
                            "/auth/master-admin-dashboard/master-admin-inbox"
                          )
                        : router.push("/auth/dashboard/inbox")
                    }
                  >
                    <UserNameEmailAvatar
                      letter={elem?.userName[0]}
                      userName={elem?.userName}
                      userEmail={elem?.userEmail}
                      assistantImage={elem?.assistantImage}
                    />
                  </div>
                  <div className="w-[20%] pt-1 cursor-pointer flex flex-col items-center justify-between h-full gap-0">
                    {assistantsSide ? (
                      <button
                        title={`${
                          elem?.status === "click to go Online"
                            ? "click to go Offline"
                            : elem?.status === "Busy"
                            ? `Busy with ${elem?.joinedWith?.user?.userEmail}`
                            : "Online"
                        }`}
                        type="button"
                        className="text-gray-900 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm text-center inline-flex items-center"
                      >
                        {elem?.status === "Online" ? (
                          <span className="relative flex h-3 w-3 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                        ) : (
                          <div
                            className={`h-2.5 w-2.5 rounded-full mr-2 cursor-pointer ${
                              elem.status === "Offline"
                                ? "bg-red-500"
                                : "bg-orange-500"
                            }`}
                          ></div>
                        )}
                        {elem?.status}
                      </button>
                    ) : (
                      <ReactCountryFlag
                        countryCode={elem?.location?.country_code}
                        svg
                        style={{
                          width: "1.5em",
                          height: "1.5em",
                        }}
                        title={elem?.location?.country_code}
                      />
                    )}

                    {!assistantsSide && (
                      <span className="text-[11px] mb-1 text-gray-700 font-semibold">
                        <TimeAgo timestamp={elem?.updatedAt} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
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

export default UsersStat;
