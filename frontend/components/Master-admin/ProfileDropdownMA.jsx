import { useAuth } from "@/context/AuthContext";
import { useMasterAdminAuth } from "@/context/MasterAdminAuthContext";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
const UserCircleIcon = dynamic(
  import("@heroicons/react/24/solid/UserCircleIcon")
);
const ProfileDropdownMA = () => {
  const { userEmailMA, setIsMasterAdminAuthenticated } = useMasterAdminAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsMasterAdminAuthenticated(false);
    localStorage.removeItem("masterAdminToken");
    localStorage.removeItem("EM_Token");
    localStorage.removeItem("user");
    localStorage.removeItem("widget_user_email");
    localStorage.removeItem("widget_user_id");
    localStorage.removeItem("joinedAssistantId");
    localStorage.removeItem("joinedAssistantEmail");
    toast("user logout successfully", {
      position: "top-center",
      theme: "dark",
    });
    window.location.href = "/login";
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-10">
      <UserCircleIcon
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full object-cover"
      />

      {isOpen && (
        <div
          className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg w-40"
          onClick={closeDropdown}
        >
          <ul className="py-2">
            <li>
              <div className="px-4 py-3 text-sm text-gray-900">
                <div className="font-medium truncate">{userEmailMA}</div>
              </div>
            </li>
            <hr />

            <li>
              <Link
                href="/auth/master-admin-dashboard"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
              >
                Dashbaord
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdownMA;
