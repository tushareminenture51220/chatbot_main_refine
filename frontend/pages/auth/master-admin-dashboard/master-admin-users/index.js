import UserNameEmailAvatar from "@/components/miniComponants/UserNameEmailAvatar";
import NoUsersFound from "@/components/NoUsersFound";
import { useMasterAdminCommonData } from "@/context/MasterAdminCommonData";
import { ArrowsUpDownIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

const MasterAdminUsers = () => {
  const [filterValue, setFilterValue] = useState("all");
  const [liveChatAAUsers, setLiveChatAAUsers] = useState([]);
  const { linkedAccountsData, getAllAccountsUsersData, allAcountsUsersData } =
    useMasterAdminCommonData();



  useEffect(() => {
    // Set liveChatAAUsers based on filtered data
    if (allAcountsUsersData?.length > 0) {
      const filteredData =
        filterValue === "all"
          ? allAcountsUsersData // Use allAcountsUsersData instead of linkedAccountsData
          : allAcountsUsersData.filter((user) => user.adminId === filterValue);

      setLiveChatAAUsers(filteredData); // Update the liveChatAAUsers state with filtered data
    }
  }, [filterValue, allAcountsUsersData]); // Include allAcountsUsersData in the dependency array

  // useEffect(() => {
  //   console.log(liveChatAAUsers);
  // }, [liveChatAAUsers]);
  return (
    <div className="relative overflow-x-hidden overflow-y-auto h-[80vh] shadow-md sm:rounded-lg w-full">
      <div className="flex items-center justify-between gap-4 pb-4 bg-white px-4 pt-4">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="w-5 h-5" />
          <h1 className="font-semibold">Users List</h1>
        </div>
        <div className="flex items-center gap-2 mr-2">
          <span>Filter by company : </span>
          <button
            onClick={() => setFilterValue("all")}
            type="button"
            className={`${
              filterValue == "all"
                ? "bg-gray-900 text-white"
                : "text-gray-900 bg-white"
            } hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1 text-center me-2`}
          >
            All
          </button>
          {linkedAccountsData?.map((elem) => (
            <button
              key={elem.accountId} // Add a key prop here
              onClick={() => setFilterValue(elem?.accountId)}
              type="button"
              className={`${
                filterValue == elem?.accountId
                  ? "text-white bg-gray-900"
                  : "text-gray-900 bg-white"
              } text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1 text-center me-2`}
            >
              {elem?.companyName}
            </button>
          ))}
        </div>
      </div>
      {liveChatAAUsers?.length > 0 ? (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <ArrowsUpDownIcon className="w-5 h-5 cursor-pointer" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Company Name
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
              {/* <th scope="col" className="px-6 py-3">
                Action
              </th> */}
            </tr>
          </thead>
          <tbody>
            {liveChatAAUsers?.map((elem) => (
              <tr key={elem._id} className="bg-white border-b hover:bg-gray-50">
                <td className="w-4 p-4">
                  <div className="flex items-center justify-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full mr-2 ${
                        elem?.status ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                </td>
                <th className="px-6 py-4">
                  {linkedAccountsData.find(
                    (item) => item.accountId === elem.adminId
                  )?.companyName || "Company not found"}
                </th>
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
                {/* <td>
                  <button className="font-medium bg-blue-200 px-2 py-1 rounded-md text-blue-600 hover:underline">
                    Join Chat
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <NoUsersFound
          title={"No Users Found"}
          description={
            "We couldn't find any linked accounts. Please check back later or try linking your account again."
          }
        />
      )}
    </div>
  );
};

export default MasterAdminUsers;
