import { useLiveChatData } from "@/context/livechatContext";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TableSkeleton from "../Loders/TableSkeleton";
import AssistantRegForm from "./AssistantRegForm";
import ReactCountryFlag from "react-country-flag";
import UserNameEmailAvatar from "../miniComponants/UserNameEmailAvatar";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const MagnifyingGlassIcon = dynamic(
  import("@heroicons/react/24/outline/MagnifyingGlassIcon")
);
const UsersIcon = dynamic(import("@heroicons/react/24/solid/UsersIcon"));
const UserPlusIcon = dynamic(import("@heroicons/react/24/solid/UserPlusIcon"));
const ChevronDownIcon = dynamic(
  import("@heroicons/react/24/outline/ChevronDownIcon")
);
const OurAssistantList = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { assistants, getLiveChatAssistants } = useLiveChatData();
  const [showForm, setShowForm] = useState(false);
  const { authJWTToken, userId } = useAuth();
  const [selectedUser, setSelectedUser] = useState({});
  const handleLogoutFromAll = async (assistantId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/chatbot/resetJoinedExecutiveStatus/${assistantId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log(data);
        toast.success("All users logged out successfully.");

        getLiveChatUsers(authJWTToken, userId);
      } else {
        console.log("Failed to log out users.");
      }
    } catch (e) {
      console.error("Error logging out users:", e);
    }
  };
  const updateAssistantStatus = (payload, token) => {
    fetch(
      `${process.env.NEXT_PUBLIC_EMBOT_API}/live/check-assistant/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.status == "error") {
          toast.error(res.message);
        } else {
          getLiveChatAssistants(authJWTToken, userId);
          toast.success(res.message);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteAssistants = async () => {
    try {
      // Sending the DELETE request using fetch
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/live/deleteMultipleAssistants`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedUser), // Converting the assistantIds object to JSON
        }
      );

      // Handling the response
      if (response.ok) {
        const result = await response.json();
        getLiveChatAssistants(authJWTToken, userId);
        toast.success(result.message);
      } else {
        console.log("No assistants were deleted.");
      }
    } catch (error) {
      console.error("Error deleting assistants:", error.message);
    }
  };
  useEffect(() => {
    if (authJWTToken && userId) {
      getLiveChatAssistants(authJWTToken, userId);
    }
  }, [authJWTToken, userId, assistants]);
  // console.log("assistants", assistants);
  return (
    <div className="relative overflow-x-hidden overflow-y-auto h-[80vh] shadow-md sm:rounded-lg w-full">
      <div className="flex items-center justify-between gap-4 pb-4 bg-white px-2 pt-4">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5" />
          <h1 className="font-semibold">Assistance List</h1>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowForm(true)}
            className="relative inline-flex items-center justify-center p-0.5 mb-0 mr-0 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200"
          >
            <UserPlusIcon className="w-4 h-4 text-white mx-1" />
            <span className="relative px-3 py-1 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
              Add Assistant
            </span>
          </button>
          <div className="mr-10">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              id="dropdownActionButton"
              data-dropdown-toggle="dropdownAction"
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5"
              type="button"
            >
              <span className="sr-only">Action button</span>
              Action
              <ChevronDownIcon className="w-2.5 h-2.5 ml-2.5" />
            </button>

            {showDropdown && (
              <div className="z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-fit m-2 absolute">
                <div className="py-1">
                  <button
                    onClick={() => deleteAssistants()}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center"></div>
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {assistants?.map((elem, index) => (
            <tr key={elem?._id} className="bg-white border-b hover:bg-gray-50">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    onChange={(e) =>
                      setSelectedUser((prevUsers) => ({
                        ...prevUsers,
                        [index]: elem?._id,
                      }))
                    }
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
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
                  assistantImage={elem?.assistantImage}
                />
              </th>
              <td className="px-6 py-4"> {elem?.userEmail}</td>
              <td className="px-6 py-4">
                {/* <button
                  title={`${
                    elem?.status == "click to go Online"
                      ? "click to go Offline"
                      : elem?.status == "Busy"
                      ? `Busy with ${elem?.joinedWith?.user?.userEmail}`
                      : "Online"
                  }`}
                  onClick={() => {
                    elem.status == "Busy"
                      ? toast.warn(
                          "Log out from the current chat session to update your status."
                        )
                      : updateAssistantStatus(
                          {
                            status:
                              elem?.status == "Online" ? "Offline" : "Online",
                            email: elem?.userEmail,
                          },
                          authJWTToken
                        );
                  }}
                  type="button"
                  className="text-gray-900 relative bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                >
                  {elem?.status == "Online" ? (
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
                </button> */}
                <button
                  onClick={() => handleLogoutFromAll(elem?._id)}
                  className="text-gray-900 relative bg-green-400 hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                >
                  Logout All
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {assistants?.length == 0 && (
        <>
          <div className="text-center bg-gray-100 text-gray-700 p-4 rounded shadow-md">
            <p className="text-lg font-semibold">No assistants found</p>
            <p className="text-sm mt-2">
              Create new assistants by clicking the{" "}
              <span className="text-blue-500 font-medium">"Add Assistant"</span>{" "}
              button.
            </p>
          </div>
          <TableSkeleton />
        </>
      )}
      {showForm && <AssistantRegForm setShowForm={setShowForm} />}
    </div>
  );
};

export default OurAssistantList;
