import {
  ChevronDownIcon,
  ExclamationCircleIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import UserNameEmailAvatar from "../miniComponants/UserNameEmailAvatar";

const AccountsPage = ({
  showForm,
  setShowForm,
  linkedAccountsData,
  getData,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const deleteAccounts = async () => {
    try {
      // Sending the DELETE request using fetch
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/master/delete-linked-accounts`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedUser),
        }
      );

      // Handling the response
      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        getData();
      } else {
        console.log("No accounts were deleted.");
      }
    } catch (error) {
      console.error("Error deleting accounts:", error.message);
    }
  };

  useEffect(() => {
    console.log(selectedUser);
  }, [selectedUser]);
  return (
    <div className="relative overflow-x-hidden overflow-y-auto h-[80vh] shadow-md sm:rounded-lg w-full">
      <div className="flex items-center justify-between gap-4 pb-4 bg-white px-2 pt-4">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5" />
          <h1 className="font-semibold">Connected Accounts List</h1>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="relative inline-flex items-center justify-center p-0.5 mb-0 mr-0 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200"
          >
            <UserPlusIcon className="w-4 h-4 text-white mx-1" />
            <span className="relative px-3 py-1 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
              Add Accounts
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
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to unlink selected account?"
                        )
                      ) {
                        deleteAccounts();
                      }
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {linkedAccountsData?.length > 0 ? (
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center"></div>
              </th>
              <th scope="col" className="px-6 py-3">
                Company Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                website
              </th>
            </tr>
          </thead>

          <tbody>
            {linkedAccountsData?.map((elem, index) => (
              <tr
                key={elem?._id}
                className="bg-white border-b hover:bg-gray-50"
              >
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
                    <label
                      htmlFor="checkbox-table-search-1"
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="flex items-center text-gray-900 whitespace-nowrap px-6 py-4"
                >
                  <UserNameEmailAvatar
                    letter={elem?.companyName[0]}
                    userName={elem?.companyName}
                    userEmail={elem?.accountEmail}
                    assistantImage={elem?.companyLogo}
                  />
                </th>
                <td className="px-6 py-4"> {elem?.accountEmail}</td>
                <td className="px-6 py-4"> {elem?.companyWebsite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div
          className="max-w-full mt-5 mx-auto p-6 mb-6 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg shadow-lg flex items-center"
          role="alert"
        >
          <ExclamationCircleIcon className="h-6 w-6 text-blue-500 mr-3" />
          <div>
            <span className="font-bold block text-lg">
              {" "}
              No accounts linked with this master admin found.
            </span>

            <p className="mt-1">
              You can link an account by clicking on the{" "}
              <strong>'Add Accounts'</strong> button.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
