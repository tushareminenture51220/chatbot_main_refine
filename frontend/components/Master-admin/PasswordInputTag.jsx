import React, { useState } from "react";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
const PasswordInputTag = ({ label, name, handleChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <label
        htmlFor="email-address"
        className="block mt-4 mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <LockClosedIcon className="w-5 h-5 text-gray-500" />
        </div>
        <input
          onChange={handleChange}
          name={name}
          type={showPassword ? "text" : "password"}
          id="email-address"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
          placeholder={showPassword ? "abcd@123" : "********"}
          required
        />
        <div
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 end-2 flex items-center ps-3 pointer-events-auto"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
          ) : (
            <EyeIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
          )}
        </div>
      </div>
    </>
  );
};

export default PasswordInputTag;
