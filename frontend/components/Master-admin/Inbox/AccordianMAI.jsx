import UserNameEmailAvatar from "@/components/miniComponants/UserNameEmailAvatar";
import TimeAgo from "@/components/TimeAgo";
import { PlayIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

const AccordianMAI = ({ accountData, onUserClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggler = () => {
    setIsOpen(!isOpen);
  };

  // useEffect(() => {
  //   console.log("accountData", accountData);
  // }, [accountData]);

  return (
    <div>
      <button
        type="button"
        className={`${
          isOpen ? "bg-gray-100" : ""
        } flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100`}
        aria-controls="dropdown-example"
        onClick={toggler}
      >
        <PlayIcon
          className={`w-3 h-3 mr-1 mt-1 transition-transform duration-300 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
        <span className="flex-1 ms-0 text-left rtl:text-right whitespace-nowrap">
          {accountData?.companyWebsite}
        </span>
        <svg
          className="w-2.5 h-2.5 mt-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <div
        className={`py-3 px-4 cursor-pointer space-y-2 transition-all ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {accountData?.users
          ?.filter((user) => user?.deletedStatus === true)
          .map((user, index) => (
            <div
              key={index}
              className="hover:bg-gray-100 flex"
              onClick={() =>
                onUserClick({
                  ...user,
                  companyWebsite: accountData?.companyWebsite,
                  adminEmail: accountData?.accountEmail,
                })
              }
            >
              <div className="w-[80%] truncate mt-2">
                <UserNameEmailAvatar
                  letter={user?.userName[0]}
                  userName={user?.userName}
                  userEmail={user?.userEmail}
                />
              </div>
              <div className="w-[20%] pt-1 cursor-pointer flex flex-col items-center justify-between h-full gap-0">
                <span className="text-[11px] mb-1 text-gray-700 font-semibold">
                  <TimeAgo timestamp={user?.updatedAt} />
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AccordianMAI;
