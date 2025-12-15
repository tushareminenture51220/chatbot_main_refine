import React from "react";
import { useMasterAdminLinksData } from "@/context/MasterAdminLinksDataContext";
import { useMasterAdminAuth } from "@/context/MasterAdminAuthContext";
import ProfileDropdownMA from "./ProfileDropdownMA";
import NotificationDropdownMA from "./NotificationDropdownMA";

const MAHorizontalNav = () => {
  const { active } = useMasterAdminLinksData();

  return (
    <div className="bg-white float-right w-full mt-2 p-4 rounded-lg shadow-sm h-20">
      {/* Dashbord horizontal Navbar */}
      <div className="flex items-center justify-between">
        <div>
          <p>
            Pages / <strong>{active}</strong>
          </p>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <NotificationDropdownMA />
          <div>
            <ProfileDropdownMA />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MAHorizontalNav;
