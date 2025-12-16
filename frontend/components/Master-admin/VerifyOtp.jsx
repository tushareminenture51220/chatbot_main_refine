import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import MasterChangePassword from "./MasterChangePassword";

const VerifyOtp = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("OTP is required");
      return;
    }

    axios({
      url: `${process.env.NEXT_PUBLIC_EMBOT_API}/master/master-otp-verify`,
      method: "POST",
      data: { email, otp },
    })
      .then((res) => {
        toast.success(res?.data?.message);
        setVerified(true);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Invalid OTP");
      });
  };

  if (verified) {
    return <MasterChangePassword email={email} />;
  }

  return (
    <>
      <h1 className="text-2xl text-center font-bold text-gray-900 mt-[100px]">
        Verify OTP
      </h1>

      <p className="text-sm text-center text-gray-600 mb-6">
        Enter the OTP sent to <strong>{email}</strong>
      </p>

      <form onSubmit={handleVerifyOtp} className="max-w-md mx-auto">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          OTP
        </label>

        <input
          type="number"
          className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          placeholder="Enter 4-digit OTP"
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-4 w-full text-white bg-blue-500 p-2 rounded-lg"
        >
          Verify OTP
        </button>
      </form>
    </>
  );
};

export default VerifyOtp;
