import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import VerifyOtp from "@/components/Master-admin/VerifyOtp";

const MasterForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    axios({
      url: `${process.env.NEXT_PUBLIC_EMBOT_API}/master/forget-password`,
      method: "POST",
      data: { email },
    })
      .then((res) => {
        toast.success(res?.data?.message);
        setShowOtpVerify(true);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  };

  if (showOtpVerify) {
    return <VerifyOtp email={email} />;
  }

  return (
    <>
      <h1 className="text-2xl text-center font-bold text-gray-900 mt-[100px]">
        Forgot Password
      </h1>

      <p className="text-sm text-center text-gray-600 mb-6">
        Enter your registered email. We’ll send you a 4-digit OTP.
      </p>

      <form
        ref={formRef}
        className="max-w-md mx-auto"
        onSubmit={handleSubmit}
      >
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Your Email
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <EnvelopeIcon className="w-5 h-5 text-gray-500" />
          </div>

          <input
            type="email"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
            placeholder="admin@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full text-white bg-blue-500 p-2 rounded-lg"
        >
          Send OTP
        </button>
      </form>
    </>
  );
};

export default MasterForgetPassword;
