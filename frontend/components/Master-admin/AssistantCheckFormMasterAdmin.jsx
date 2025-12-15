import { useAuth } from "@/context/AuthContext";
import { useLiveChatData } from "@/context/livechatContext";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import OtpInput from "../OtpInput";
import UserNameEmailAvatar from "../miniComponants/UserNameEmailAvatar";
import { io } from "socket.io-client";
import { useSocket } from "@/context/SocketContext";
import { useMALiveChatData } from "@/context/MALiveChatContext";
import { useMasterAdminAuth } from "@/context/MasterAdminAuthContext";
import { useMasterAdminCommonData } from "@/context/MasterAdminCommonData";
import { useMasterAdminSocket } from "@/context/SocketMasterAdminContext";

const EnvelopeIcon = dynamic(
  import("@heroicons/react/24/outline/EnvelopeIcon")
);
const ShieldCheckIcon = dynamic(
  import("@heroicons/react/24/solid/ShieldCheckIcon")
);

const AssistantCheckFormMasterAdmin = ({ setShowForm, user }) => {
  const [formData, setFormData] = useState({ email: "", pin: "" });
  const { maJWTToken, userIdMA } = useMasterAdminAuth();
  const { joinedChatAssistantMA, setJoinedChatAssistantMA } =
    useMALiveChatData();
  const { getAllAccountsUsersData, prasentAccounts, setActiveCWUsers } =
    useMasterAdminCommonData();
  // const socket = useRef();
  const { socketMA } = useMasterAdminSocket();
  const [suggestions, setSuggestions] = useState([]);
  const [stopSearch, setStopSearch] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e) => {
    setFormData((prevData) => ({ ...prevData, email: e.target.value }));
  };

  const handlePinChange = (newPinValue) => {
    setFormData((prevData) => ({ ...prevData, pin: newPinValue }));
  };

  const fetchSuggestions = async (value) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/master/get-assistant/${userIdMA}/${value}`
      );
      const data = await response.json();
      if (data.status == "success") {
        setSuggestions(data.data);
      } else {
        toast.error("404! not found");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const updateAssistantStatus = (payload, token) => {
    fetch(
      `${process.env.NEXT_PUBLIC_EMBOT_API}/master/check-assistant/${userIdMA}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          const socketData = {
            userId: user._id,
            Assi_userName: res.data.userName,
            Assi_userEmail: res.data.userEmail,
            Assi__id: res.data._id,
            assistantImage: res.data.assistantImage,
          };
          setTimeout(() => {
            socketMA.current.emit("addUser", res.data._id);
          }, 100);
          socketMA.current.emit("JoinedAssistantDirectly", socketData);
          if (router.pathname.endsWith("inbox")) {
            localStorage.setItem(
              "joinedChatAssistantMA",
              JSON.stringify({
                userName: res.data.userName,
                userEmail: res.data.userEmail,
                _id: res.data._id,
                assistantImage: res.data.assistantImage,
              })
            );
            setJoinedChatAssistantMA({
              userName: res.data.userName,
              userEmail: res.data.userEmail,
              _id: res.data._id,
              assistantImage: res.data.assistantImage,
            });
            setActiveCWUsers((prevUsers) =>
              prevUsers.map((elem) =>
                elem._id === user._id
                  ? {
                      ...elem,
                      joinedExecutive: {
                        status: true,
                        executive: {
                          userName: res.data.userName,
                          userEmail: res.data.userEmail,
                          _id: res.data._id,
                          assistantImage: res.data.assistantImage,
                        },
                      },
                    }
                  : elem
              )
            );

            setShowForm(false);
          } else {
            setJoinedChatAssistantMA({
              userName: res.data.userName,
              userEmail: res.data.userEmail,
              _id: res.data._id,
              assistantImage: res.data.assistantImage,
            });
            localStorage.setItem(
              "joinedChatAssistantMA",
              JSON.stringify({
                userName: res.data.userName,
                userEmail: res.data.userEmail,
                _id: res.data._id,
                assistantImage: res.data.assistantImage,
              })
            );
            setActiveCWUsers((prevUsers) =>
              prevUsers.map((elem) =>
                elem._id === user._id
                  ? {
                      ...elem,
                      joinedExecutive: {
                        status: true,
                        executive: {
                          userName: res.data.userName,
                          userEmail: res.data.userEmail,
                          _id: res.data._id,
                          assistantImage: res.data.assistantImage,
                        },
                      },
                    }
                  : elem
              )
            );

            updateUserDeleteStatus(user?._id, true);
            router.push("/auth/master-admin-dashboard/master-admin-inbox");
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const updateUserDeleteStatus = async (id, status) => {
    //  console.log("id, status,", id);
    try {
      // Convert the boolean status to a string 'true' or 'false'
      const statusString = status ? "true" : "false";

      // Send PATCH request to update the user's delete status
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/master/changeUserDeleteStatus/${id}/${status}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user status");
      }

      // Parse the response JSON
      const data = await response.json();
      if (data) {
        //  console.log(data, "iser delted suucce stats");
        setTimeout(() => {
          getAllAccountsUsersData(prasentAccounts);
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      // Handle error as needed
      return { status: "error", message: error.message };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData?.pin?.length !== 6) {
      toast("Pin must be in 6 digits");
    } else {
      // console.log(formData);
    }
    //login
    const payload = {
      status: "Busy",
      joinedWith: {
        status: true,
        user: { userEmail: user?.userEmail, _id: user?._id },
      },
      ...formData,
    };

    updateAssistantStatus(payload, maJWTToken);
    //after submit form input value is emty

    setFormData({ email: "", pin: "" });
    e.target.reset();
  };

  useEffect(() => {
    let debounceTimeout;
    if (stopSearch == false) {
      debounceTimeout = setTimeout(async () => {
        if (formData.email.trim() !== "") {
          await fetchSuggestions(formData.email);
        }
        if (formData.email.trim() === "") {
          setSuggestions([]);
        }
      }, 300);
    }
    return () => clearTimeout(debounceTimeout);
  }, [formData.email, stopSearch]);

  return (
    <div
      className="relative z-10 w-full"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity w-full"></div>

      <div className="fixed inset-0 z-10 w-full overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <form onSubmit={handleSubmit}>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-base font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      Assistant Check
                    </h3>
                    <p className="text-sm text-gray-500">
                      Please provide the email address that you used to register
                      as an Assistant in order to continue the live chat with
                      the user.
                    </p>
                    <div className="mt-2 w-full">
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          onChange={handleEmailChange}
                          value={formData?.email}
                          type="email"
                          id="simple-search"
                          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5  "
                          placeholder="Type assistant email..."
                          required
                        />
                        {suggestions?.length > 0 && (
                          <div className="divide-gray-200 absolute w-full max-h-40 overflow-y-auto bg-white rounded-lg border shadow-md">
                            {suggestions.map((elem) => (
                              <div
                                key={elem._id}
                                className="hover:bg-purple-50 px-2 py-2 cursor-pointer"
                                onClick={() => {
                                  setStopSearch(true);
                                  setFormData({
                                    ...formData,
                                    email: elem.userEmail,
                                  });
                                  setSuggestions([]);
                                }}
                              >
                                <UserNameEmailAvatar
                                  letter={elem.userName[0]}
                                  userName={elem.userName}
                                  userEmail={elem.userEmail}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col mt-2">
                        <div>
                          <h3
                            className="text-base font-semibold leading-6 text-gray-900"
                            id="modal-title"
                          >
                            Please Enter Your 6 Digit Secret Pin
                          </h3>
                        </div>
                        <OtpInput
                          pinValue={formData.pin}
                          onPinChange={handlePinChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  Submit
                </button>
                {setShowForm && (
                  <button
                    onClick={() => setShowForm(false)}
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantCheckFormMasterAdmin;
