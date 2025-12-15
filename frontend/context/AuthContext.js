import React, { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { customHash } from "@/utiles/cryptoUtils";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

// authentication context
const AuthContext = createContext();

//custom hook to access the authentication state
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [authJWTToken, setAuthJWTToken] = useState("");
  const [userId, setUserId] = useState("");
  const [hashedId, setHashedId] = useState("");
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const router = useRouter();
  const isShow = router.pathname.endsWith("/set-triggers-&-response");

  const getUserData = async (token) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/auth/get-user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  let getDataFunc;
  // Checking here the token's expiration when the app loads
  useEffect(() => {
    const token = localStorage.getItem("EM_Token");
    const userSS = JSON.parse(localStorage.getItem("user"));
    setAuthJWTToken(token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUserId(decodedToken.id);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Handle decoding errors
        console.error("Error decoding token:", error);
      }
    }
    getDataFunc = setTimeout(() => {
      if (token && userSS) {
        getUserData(token)
          .then((res) => {
            if (res.status == "error") {
              setUser({ ...userSS, profile: false });
            } else {
              const mainUserData = {
                ...res.data,
                website: userSS.website,
                email: userSS.email,
                _id: userSS._id,
                profile: true,
                theme: userSS.theme,
              };
              if (mainUserData) {
                setUser(mainUserData);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });

        setUser({
          ...user,
          website: userSS.website,
          email: userSS.email,
          _id: userSS._id,
          theme: userSS.theme,
          profile: false,
        });
      }
    }, 1000);
  }, []);
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("EM_Token");
    localStorage.removeItem("user");
    localStorage.removeItem("widget_user_email");
    localStorage.removeItem("widget_user_id");
    localStorage.removeItem("joinedAssistantId");
    localStorage.removeItem("joinedAssistantEmail");
    toast("Session timeout. Please login again!", {
      position: "top-center",
      theme: "dark",
    });
    window.location.href = "/login";
  };
  useEffect(() => {
    const token = localStorage.getItem("EM_Token");
    const userSS = JSON.parse(localStorage.getItem("user"));
    setAuthJWTToken(token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUserId(decodedToken.id);
        } else {
          setIsAuthenticated(false);
          handleLogout();
        }
      } catch (error) {
        // Handle decoding errors
        console.error("Error decoding token:", error);
      }
    }
  }, [isAuthenticated, authJWTToken]);

  useEffect(() => {
    if (userId) {
      const hashedIdGenerated = customHash(userId, "EMReact");
      setHashedId(hashedIdGenerated);
    }
  }, [userId]);

  // console.log(userId)
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        authJWTToken,
        getDataFunc,
        userId,
        hashedId,
        setHashedId,
        isShow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
