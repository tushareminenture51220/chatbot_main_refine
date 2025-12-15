import React, { useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/solid";

import AccordianMAI from "./AccordianMAI";
const MasterAdminInboxUsers = ({ mergedDataMA, onUserClick }) => {
  console.log(mergedDataMA, "accountData");
  return (
    <aside className="min-w-72 w-72 border h-[82vh] transition-transform -translate-x-full sm:translate-x-0">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
        <ul className="space-y-2 font-medium">
          <li>
          <a
              href="#"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            >
              <UserGroupIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
              <span className="ms-3">Master Admin Users</span>
            </a>
          </li>
          <hr />
          {mergedDataMA?.map((accountData, index) => (
            <li key={index}>
              <AccordianMAI
                onUserClick={onUserClick}
                accountData={accountData}
              />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default MasterAdminInboxUsers;
