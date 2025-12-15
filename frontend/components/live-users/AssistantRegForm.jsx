import { useAuth } from "@/context/AuthContext";
import { useLiveChatData } from "@/context/livechatContext";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InlineLoader from "../Loders/InlineLoader";
import OtpInput from "../OtpInput";
import PhotoIcon from "@heroicons/react/24/solid/PhotoIcon";
const UserPlusIcon = dynamic(import("@heroicons/react/24/solid/UserPlusIcon"));
const XMarkIcon = dynamic(import("@heroicons/react/24/solid/XMarkIcon"));
const AssistantRegForm = ({ setShowForm }) => {
  const { authJWTToken, userId } = useAuth();
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userId: userId,
    adminPin: "",
    assistantImage: null,
  });
  const [showImg, setShowImg] = useState("");
  const { getLiveChatAssistants } = useLiveChatData();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "assistantImage") {
      if (type === "file" && files.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: files[0],
        }));
        setShowImg(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  //console.log(formData, "formData");
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formDataToSend = new FormData();
    formData?.userName && formDataToSend.append("userName", formData.userName);
    formData?.userEmail &&
      formDataToSend.append("userEmail", formData.userEmail);
    formData?.userId && formDataToSend.append("userId", formData.userId);
    formData?.adminPin && formDataToSend.append("adminPin", formData.adminPin);
    formData?.assistantImage &&
      formDataToSend.append("assistantImage", formData.assistantImage);
    // console.log(formData);
    //console.log(Object.fromEntries(formDataToSend));
    // ${process.env.NEXT_PUBLIC_EMBOT_API}
    const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/live/create-assistant`;
    fetch(API_PATH, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authJWTToken}`,
      },
      body: formDataToSend,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status == "success") {
          toast.success(data.message);
          getLiveChatAssistants(authJWTToken, userId);
          setIsLoading(false);
          setShowForm(false);
          setFormData({
            userName: "",
            userEmail: "",
            location: {},
            userId: "",
            adminPin: "",
          });
          e.target.reset();
          setShowForm(false);
        } else {
          toast.error(data.message);
          setIsLoading(false);
          setFormData({
            userName: "",
            userEmail: "",
            location: {},
            userId: "",
            adminPin: "",
          });
          e.target.reset();
          setShowForm(false);
        }
      })
      .catch((e) => {
        toast.error(e);
        console.log(e);
        setIsLoading(false);
      });
  };
  const handlePinChange = (newPinValue) => {
    setFormData((prevData) => ({ ...prevData, adminPin: newPinValue }));
  };

  useEffect(() => {
    if (userId) {
      setFormData({ ...formData, userId: userId });
    }
  }, [userId]);
  return (
    <div
      id="authentication-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 w-full inset-0 bg-gray-500 bg-opacity-75 transition-opacity min-w-fit max-w-full p-4 grid place-content-center overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow w-96">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
            data-modal-hide="authentication-modal"
          >
            <XMarkIcon className="w-5 h-5" />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 flex gap-2 items-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 sm:mx-0 sm:h-10 sm:w-10">
                <UserPlusIcon className="h-6 w-6 text-cyan-600" />
              </div>
              <span>Add Assistant</span>
            </h3>
            {isLoading && <InlineLoader />}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="mt-4">
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
                      htmlFor="inline-file-upload"
                    >
                      Assistant Picture
                    </label>
                  </div>
                  <div className="md:w-2/3 flex items-center space-x-2">
                    <label className="cursor-pointer relative">
                      <div className="border-2 border-gray-300 hover:border-blue-200 rounded-full w-16 h-16 flex items-center justify-center">
                        {showImg ? (
                          <img
                            src={showImg}
                            alt="Selected"
                            className="max-h-16 max-w-16 rounded-full w-full object-cover"
                          />
                        ) : (
                          <PhotoIcon className="h-8 w-8 mx-auto text-gray-400 hover:text-blue-500" />
                        )}
                      </div>
                      <input
                        onChange={handleChange}
                        accept=".jpg, .jpeg, .png, .webp"
                        name="assistantImage"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="userName"
                  placeholder="Enter Assistant Name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  name="userEmail"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter Assistant Email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-900"
                >
                  Enter Admin Secret Pin
                </label>
                <OtpInput
                  pinValue={formData.adminPin}
                  onPinChange={handlePinChange}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantRegForm;
