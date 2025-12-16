import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MasterChangePassword = ({ email }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Both fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    axios({
      url: `${process.env.NEXT_PUBLIC_EMBOT_API}/master/change-password`,
      method: "POST",
      data: { email, password },
    })
      .then((res) => {
        toast.success(res?.data?.message);
        window.location.href = "/master-control";
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  };

  return (
    <>
      <h1 className="text-2xl text-center font-bold text-gray-900 mt-[100px]">
        Change Password
      </h1>

      <p className="text-sm text-center text-gray-600 mb-6">
        Set a new password for <strong>{email}</strong>
      </p>

      <form
        onSubmit={handleChangePassword}
        className="max-w-md mx-auto"
      >
        <label className="block mb-2 text-sm font-medium text-gray-900">
          New Password
        </label>
        <input
          type="password"
          className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-4"
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium text-gray-900">
          Confirm Password
        </label>
        <input
          type="password"
          className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-4 w-full text-white bg-blue-500 p-2 rounded-lg"
        >
          Update Password
        </button>
      </form>
    </>
  );
};

export default MasterChangePassword;
