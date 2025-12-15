import { EnvelopeIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OtpInput from "../OtpInput";
import { useMasterAdminAuth } from "@/context/MasterAdminAuthContext";
import axios from "axios";

const OTPVerficationForm = ({
  setShowForm,
  setShowOTPForm,
  emailInProcess,
  setEmailInProcess,
  setIsLoading,
  getData,
}) => {
  const { userIdMA } = useMasterAdminAuth();
  const [formData, setFormData] = useState({ email: "", otp: "" });

  const handlePinChange = (newPinValue) => {
    setFormData((prevData) => ({ ...prevData, otp: newPinValue }));
  };
  const handleEmailChange = (e) => {
    setFormData((prevData) => ({ ...prevData, email: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData?.otp?.length !== 6) {
      toast.warning("Pin must be in 6 digits");
    } else {
      setIsLoading(true);
      axios({
        url: `${process.env.NEXT_PUBLIC_EMBOT_API}/master/add-account`,
        method: "POST",
        data: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          toast.success(res?.data?.message);
          console.log("res", res);
          setShowForm(false);
          setShowOTPForm(false);
          setEmailInProcess("");
          setIsLoading(false);
          setTimeout(() => {
            getData();
          }, 100);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (userIdMA || emailInProcess) {
      setFormData((prevData) => ({
        ...prevData,
        masterAdminId: userIdMA,
        email: emailInProcess,
      }));
    }
  }, [userIdMA, emailInProcess]);
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ml-14"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <form onSubmit={handleSubmit}>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UserPlusIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Connect Your Account
                    </h3>
                    <p className="text-sm text-gray-500">
                      Please provide the email address associated with your
                      individual account on our portal to proceed with the live
                      chat.
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-1 pl-20 mb-4">
                <div>
                  <h3
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Please Enter Your 6 Digit OTP
                  </h3>
                </div>
                <OtpInput
                  pinValue={formData?.otp}
                  onPinChange={handlePinChange}
                />
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  Submit
                </button>

                <button
                  onClick={() => {
                    setShowForm(false);
                    setShowOTPForm(false);
                  }}
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowForm(true);
                    setShowOTPForm(false);
                  }}
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Resend
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerficationForm;
