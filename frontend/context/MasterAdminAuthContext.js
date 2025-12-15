import React, { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

// authentication context
const MasterAdminAuthContext = createContext();

// Custom hook to access the authentication state
export function useMasterAdminAuth() {
  return useContext(MasterAdminAuthContext);
}

// AuthProvider component
export function MasterAdminAuthProvider({ children }) {
  const [isMasterAdminAuthenticated, setIsMasterAdminAuthenticated] =
    useState(false);
  const [userIdMA, setUserIdMA] = useState("");
  const [userEmailMA, setUserEmailMA] = useState("");
  const [maJWTToken, setMAJWTToken] = useState("");
  const router = useRouter();

  const handleLogout = () => {
    setIsMasterAdminAuthenticated(false);
    localStorage.removeItem("EM_Token");
    localStorage.removeItem("masterAdminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("widget_user_email");
    localStorage.removeItem("widget_user_id");
    localStorage.removeItem("joinedAssistantId");
    localStorage.removeItem("joinedAssistantEmail");
    toast("Session timeout. Please login again!", {
      position: "top-center",
      theme: "dark",
    });
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("masterAdminToken");
    if (token) {
      try {
        setMAJWTToken(token);
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsMasterAdminAuthenticated(true);
          setUserIdMA(decodedToken.id);
          setUserEmailMA(decodedToken.email);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogout();
      }
    }
  }, []); // Empty dependency array

  return (
    <MasterAdminAuthContext.Provider
      value={{
        isMasterAdminAuthenticated,
        setIsMasterAdminAuthenticated,
        userIdMA,
        userEmailMA,
        maJWTToken,
      }}
    >
      {children}
    </MasterAdminAuthContext.Provider>
  );
}
