import { useAuth } from "@/context/AuthContext";
import { useMasterAdminAuth } from "@/context/MasterAdminAuthContext";
import { useRouter } from "next/router";
import React from "react";

const HomepageHero = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isMasterAdminAuthenticated } = useMasterAdminAuth();
  return (
    <>
      {/* Component Code */}
      <div className="grid grid-flow-col grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-center">
          <main className="max-w-screen-xl px-4 lg:px-16">
            <div className="text-left">
              <h2 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                Build Your Own
                <br />
                <span className="text-indigo-600">Custom Chatbot</span>
              </h2>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                EM Bot is a fully customizable chatbot solution that seamlessly
                integrates with any website. It empowers businesses to engage
                users, automate responses, and personalize the chat
                experience—all with easy setup and complete flexibility to match
                your needs.
              </p>
              <br />
              <button
                onClick={() =>
                  isMasterAdminAuthenticated
                    ? router.push("/auth/master-admin-dashboard")
                    : isAuthenticated
                    ? router.push("/auth/dashboard")
                    : router.push("/register")
                }
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 mr-3"
              >
                {isMasterAdminAuthenticated || isAuthenticated
                  ? "Redirect to Dashboard"
                  : "Create Account"}
              </button>
            </div>
          </main>
        </div>
        <div
          className="w-full object-cover h-72 lg:w-full md:h-screen bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://img.freepik.com/free-photo/colleagues-learning-together-group-study_23-2149211098.jpg?t=st=1735886432~exp=1735890032~hmac=febdf580a2c300f1ce6613fd735f023f3d76d2af1d8a3bca687994a95667fb57&w=900)",
          }}
        />
      </div>
    </>
  );
};

export default HomepageHero;
