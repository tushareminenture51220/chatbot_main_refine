import React from "react";
import ProfileDropdown from "../ProfileDropdown";
import { useLinksData } from "@/context/LinksDataContext";
import NotificationDropdown from "./NotificationDropdown";

const HorizontalNav = () => {
  const { active } = useLinksData();
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
          <NotificationDropdown />
          <div>
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalNav;
