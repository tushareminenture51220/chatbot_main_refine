import React, { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useMasterAdminAuth } from "@/context/MasterAdminAuthContext";

const CpuChipIcon = dynamic(import("@heroicons/react/24/outline/CpuChipIcon"));

const Bars3Icon = dynamic(import("@heroicons/react/24/outline/Bars3Icon"));

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, setIsAuthenticated } = useAuth();
  const { isMasterAdminAuthenticated } = useMasterAdminAuth();
  const [showLinks, setShowLinks] = useState(true);

  const router = useRouter();
  console.log("isMasterAdminAuthenticated", isMasterAdminAuthenticated);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("EM_Token");
    localStorage.removeItem("user");
    localStorage.removeItem("widget_user_id");
    localStorage.removeItem("widget_user_email");
    localStorage.removeItem("joinedAssistantId");
    localStorage.removeItem("joinedAssistantEmail");

    // localStorage.removeItem("joinedAssistantId");
    toast("user logout successfully", {
      position: "top-center",
      theme: "dark",
    });
    window.location.href = "/login";
  };

  useEffect(() => {
    if (isAuthenticated || isMasterAdminAuthenticated) {
      setShowLinks(false);
    } else {
      setShowLinks(true);
    }
  }, [isAuthenticated, isMasterAdminAuthenticated]);
  console.log("showLinks", showLinks);
  return (
    <nav
      id="hidden"
      className="bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-600"
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4 mx-auto">
        <Link href="/" className="flex items-center">
          <Image
            src={require("../images/embotLogo.png")}
            width={100}
            alt="Embot Logo"
          />
        </Link>

        <div className="flex md:order-2 md:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0"
          >
            <span className="sr-only">Open main menu</span>

            <Bars3Icon
              className={`w-5 h-5 transition-transform transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <div
          className={`items-center justify-between w-full gap-8 md:flex md:w-auto md:order-1 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {showLinks && (
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-700 rounded-lg bg-gray-800 md:flex-row md:space-x-8 md:mt-0 md:border-0">
              <li>
                <Link
                  href="/master-control"
                  className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                >
                  <CpuChipIcon className="w-5 h-5 inline-block mr-2" />
                  Master Admin Control
                </Link>
              </li>
            </ul>
          )}
          {isMasterAdminAuthenticated && (
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-700 rounded-lg bg-gray-800 md:flex-row md:space-x-8 md:mt-0 md:border-0">
              <li>
                <Link
                  href="/auth/master-admin-dashboard"
                  className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                >
                  <CpuChipIcon className="w-5 h-5 inline-block mr-2" />
                  Master Admin Control
                </Link>
              </li>
            </ul>
          )}
          <div className="mt-4 md:mt-0">
            {showLinks && (
              <>
                <button
                  onClick={() => router.push("/register")}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mr-3"
                >
                  Get Started
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Log in
                </button>
              </>
            )}
            {isAuthenticated && (
              <ProfileDropdown
                userImage={user.userImage}
                userEmail={user.email}
                onLogout={handleLogout}
                fullName={user.fullName}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
