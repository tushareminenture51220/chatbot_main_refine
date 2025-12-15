import { useLiveChatData } from "@/context/livechatContext";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AssistantCheckForm from "./AssistantCheckForm";
import TableSkeleton from "../Loders/TableSkeleton";
import ReactCountryFlag from "react-country-flag";
import UserNameEmailAvatar from "../miniComponants/UserNameEmailAvatar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
const MagnifyingGlassIcon = dynamic(
  import("@heroicons/react/24/outline/MagnifyingGlassIcon")
);
const ChevronDownIcon = dynamic(
  import("@heroicons/react/24/outline/ChevronDownIcon")
);
const ArrowsUpDownIcon = dynamic(
  import("@heroicons/react/24/outline/ArrowsUpDownIcon")
);
const UserGroupIcon = dynamic(
  import("@heroicons/react/24/solid/UserGroupIcon")
);
const LiveUsersList = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { users, getLiveChatUsers, joinedChatAssistant, activeChat } =
    useLiveChatData();
  const [showForm, setShowForm] = useState(false);
  const [showFormUser, setShowFormUser] = useState({});
  const { authJWTToken, userId } = useAuth();
  const { setActiveChat } = useLiveChatData();
  const router = useRouter();

  const handleSubmit = () => {};
  useEffect(() => {
    if (authJWTToken && userId) getLiveChatUsers(authJWTToken, userId);
  }, [authJWTToken, userId]);
  return (
    <div className="relative overflow-x-hidden overflow-y-auto h-[80vh] shadow-md sm:rounded-lg w-full">
      <div className="flex items-center justify-between gap-4 pb-4 bg-white px-2 pt-4">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="w-5 h-5" />
          <h1 className="font-semibold">Users List</h1>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <ArrowsUpDownIcon className="w-5 h-5 cursor-pointer" />
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Location
            </th>
            <th scope="col" className="px-6 py-3">
              Visited Page
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {users?.map((elem) => (
            <tr key={elem._id} className="bg-white border-b hover:bg-gray-50">
              <td className="w-4 p-4">
                <div className="flex items-center justify-center">
                  <div
                    className={`h-2.5 w-2.5 rounded-full mr-2 ${
                      elem?.status == true ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                </div>
              </td>
              <th
                scope="row"
                className="flex items-center text-gray-900 whitespace-nowrap px-6 py-4"
              >
                <UserNameEmailAvatar
                  letter={elem?.userName[0]}
                  userName={elem?.userName}
                  userEmail={elem?.userEmail}
                />
              </th>
              <td className="px-6 py-4"> {elem?.userEmail}</td>
              <td className="px-6 py-4 flex items-center justify-start gap-2">
                <ReactCountryFlag
                  countryCode={elem?.location?.country_code}
                  svg
                  style={{
                    width: "1.5em",
                    height: "1.5em",
                  }}
                  title={elem?.location?.country_code}
                />

                <span className="font-medium text-blue-600 hover:underline">
                  {`${elem?.location?.region}, ${elem?.location?.country_name}`}
                </span>
              </td>
              <td className="px-6 py-4">
                <Link
                  href={elem.visitedPage}
                  target="_blank"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {`${
                    elem?.visitedPage.split("/").pop().length > 0
                      ? elem?.visitedPage.split("/").pop()
                      : "Homepage"
                  }`}
                </Link>
              </td>
              <td className="px-6 py-4">
                {elem?.joinedExecutive?.status == false ? (
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setShowFormUser(elem);
                    }}
                    className="font-medium bg-blue-200 px-2 py-1 rounded-md text-blue-600 hover:underline"
                  >
                    Join Chat
                  </button>
                ) : joinedChatAssistant?._id ==
                  elem?.joinedExecutive?.executive?._id ? (
                  <button
                    onClick={() => {
                      setActiveChat({ status: true, data: elem });
                      router.push("/auth/dashboard/inbox");
                    }}
                    className="font-medium bg-green-200 px-2 py-1 rounded-md text-green-600 hover:underline"
                  >
                    resume
                  </button>
                ) : (
                  <button
                    title={`${elem?.joinedExecutive?.executive?.userName} is joined with ${elem?.userName}`}
                    className="flex items-center justify-center font-medium bg-orange-200 px-2 py-1 rounded-md text-orange-600 hover:underline"
                  >
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    <span className="text-sm">
                      {`${elem?.joinedExecutive?.executive?.userName}`}
                    </span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users?.length == 0 && <TableSkeleton />}
      {showForm && (
        <AssistantCheckForm setShowForm={setShowForm} user={showFormUser} />
      )}
    </div>
  );
};

export default LiveUsersList;
