import RegisterForm from "@/components/Master-admin/RegisterForm";
import SignInForm from "@/components/Master-admin/SignInForm";
import { useMasterAdminAuth } from "@/context/MasterAdminAuthContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
const MasterControl = () => {
  const { setIsMasterAdminAuthenticated } = useMasterAdminAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isAuthenticatedLP, setIsAuthenticatedLP] = useState(false);
  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

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
    window.location.href = "/master-control";
  };
  useEffect(() => {
    const token = localStorage.getItem("masterAdminToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticatedLP(true);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogout();
      }
    }
  }, []);
  return (
    <>
      {isAuthenticatedLP ? (
        <div className="m-24">
          <h1 className="font-semibold text-lg">
            You are already logged in Master Admin, click to redirect
            <Link href="/auth/master-admin-dashboard" className="text-blue-500">
              {" Dashboard"}
            </Link>
          </h1>
        </div>
      ) : (
        <div className="m-24">
          <div className="max-w-md mx-auto mt-8 p-5">
            <div className="flex justify-center mb-4">
              <button
                onClick={toggleForm}
                className={`px-4 py-2 mr-2 ${
                  isSignIn ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={toggleForm}
                className={`px-4 py-2 ${
                  !isSignIn ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
              >
                Register
              </button>
            </div>
            {isSignIn ? <SignInForm /> : <RegisterForm />}
          </div>
        </div>
      )}
    </>
  );
};

export default MasterControl;
