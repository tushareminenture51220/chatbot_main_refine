import { EnvelopeIcon } from "@heroicons/react/24/solid";
import PasswordInputTag from "./PasswordInputTag";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

const SignInForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const formRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios({
      url: `${process.env.NEXT_PUBLIC_EMBOT_API}/master/login-user`,
      method: "POST",
      data: formData,
    })
      .then((res) => {
        toast.success(res?.data?.message);
        localStorage.setItem("masterAdminToken", res?.data?.token);
        formRef.current.reset();
        window.location.href = "/auth/master-admin-dashboard";
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Login failed");
        formRef.current.reset();
      });
  };

  return (
    <>
      <h1 className="text-2xl text-center font-bold text-gray-900 mb-4">
        Log In as Master Admin
      </h1>

      <form ref={formRef} className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Your Email
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <EnvelopeIcon className="w-5 h-5 text-gray-500" />
          </div>

          <input
            name="email"
            onChange={handleChange}
            type="email"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
            placeholder="name@gmail.com"
            required
          />
        </div>

        <PasswordInputTag
          name="password"
          label="Your Password"
          handleChange={handleChange}
        />


        {/* Forgot Password link */}
        <div className="text-right mt-2">
          <Link
            href="/master-forget-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          className="mt-4 w-full text-white bg-blue-500 p-2 rounded-lg"
        >
          Sign In
        </button>
      </form>
    </>
  );
};

export default SignInForm;
