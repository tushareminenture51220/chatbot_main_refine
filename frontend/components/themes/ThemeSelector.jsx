import { userAgent } from "next/server";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ThemeSelector = ({ adminId }) => {
  const [selectedTheme, setSelectedTheme] = useState(
    "linear-gradient(to top, rgba(0, 200, 83, 0), #3b71ca)"
  );
  const [isLoading, setIsLoading] = useState(false);

  const themes = [
    "linear-gradient(135deg, rgb(42, 39, 218) 0%, rgb(0, 204, 255) 100%)",
    "linear-gradient(135deg, rgb(9, 32, 63) 0%, rgb(83, 120, 149) 100%)",
    "linear-gradient(135deg, rgb(42, 39, 218) 0%, rgb(0, 204, 255) 100%)",
    "linear-gradient(135deg, rgb(255, 78, 111) 0%, rgb(251, 145, 104) 100%)",
    "linear-gradient(135deg, rgb(64, 29, 186) 0%, rgb(130, 91, 240) 100%)",
    "linear-gradient(135deg, rgb(202 2 255) 0%, hsla(180, 51.4%, 51.6%, 1) 100%)",
    "linear-gradient(135deg, rgb(41, 50, 60) 0%, rgb(72, 85, 99) 100%)",
    "linear-gradient(135deg, rgb(25, 2, 92) 0%, rgb(110, 40, 191) 100%)",
    "linear-gradient(135deg, rgb(49, 0, 62) 0%, rgb(195, 40, 110) 100%)",
    "linear-gradient(135deg, rgb(152, 3, 58) 0%, rgb(247, 79, 40) 100%)",
    "linear-gradient(135deg, rgb(4, 124, 141) 0%, rgb(47, 242, 137) 100%)",
    "linear-gradient(135deg, rgb(0, 201, 255) 0%, rgb(146, 254, 157) 100%)",
    "linear-gradient(135deg, rgb(138, 113, 109) 0%, rgb(232, 183, 148) 100%)",
    "linear-gradient(135deg, rgb(253, 160, 133) 0%, rgb(246, 211, 101) 100%)",
    "linear-gradient(135deg, rgb(250, 112, 154) 0%, rgb(254, 187, 64) 100%)",
    "linear-gradient(135deg, rgb(255, 88, 88) 0%, rgb(240, 152, 25) 100%)",
    "linear-gradient(135deg, rgb(124, 58, 183) 0%, rgb(255, 154, 173) 100%)",
  ];

  const getAdminData = async (userId) => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/auth/get-widegt-admin-data/${adminId}`
      );
      let data = await res.json();
      setTimeout(() => {
        setSelectedTheme(data.data.theme);
      }, 100);
    } catch (e) {
      console.log(e);
    }
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  const saveTheme = async () => {
    const payload = { theme: selectedTheme };
    setTimeout(() => {
      setIsLoading(true);
    }, 100);
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/auth/update-user-theme/${adminId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      let data = await res.json();
      // console.log("res", data);
      if (data.status == true) {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
        toast.success(data.message);
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
        toast.success(data.message);
      }
    } catch (e) {
      console.log(e);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };

  useEffect(() => {
    if (adminId) {
      getAdminData(adminId);
    }
  }, [adminId]);

  return (
    <div className="w-full max-w-md">
      <h3 className="text-xl font-semibold text-gray-900">
        Select your personalized theme
      </h3>
      <div className="flex items-center border-b border-teal-500 py-2"></div>
      <div className="flex items-center justify-between w-full max-w-xs p-4 mb-8 mt-8 text-gray-500 bg-white rounded-lg shadow ">
        <div className="flex items-center">
          <div
            style={{ background: selectedTheme }}
            className="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 text-green-500 bg-green-100 rounded-lg"
          ></div>
          <div className="ms-3 text-md font-semibold">Selected Theme</div>
        </div>
        <button
          onClick={() => saveTheme()}
          type="button"
          className="flex items-center text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-0"
        >
          {isLoading ? (
            <>
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 me-2 text-gray-200 animate-spin fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
              Saving
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
      <div className="grid grid-cols-5 gap-4 my-2">
        {themes.map((elem, index) => (
          <div
            key={index}
            className={`bg-gray-200 p-4 rounded-full w-16 h-16 cursor-pointer transition-transform transform hover:scale-110 ${
              selectedTheme === elem ? "border border-black" : ""
            }`}
            style={{ background: elem }}
            onClick={() => handleThemeSelect(elem)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
