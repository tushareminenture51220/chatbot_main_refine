import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import PasswordInputTag from "./PasswordInputTag";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const formRef = useRef(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData?.confirmPassword == formData?.password) {
      const payload = { email: formData?.email, password: formData?.password };
      axios({
        url: `${process.env.NEXT_PUBLIC_EMBOT_API}/master/create-user`,
        method: "POST",
        data: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          toast.success(res?.data?.message);
          formRef.current.reset();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          formRef.current.reset();
        });
    } else {
      toast.error("Password not Matched!");
      formRef.current.reset();
    }
  };
  return (
    <>
      <h1 className="text-2xl text-center font-bold text-gray-900 mb-4">
        Create Master Admin Account
      </h1>
      <form ref={formRef} className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <label
          htmlFor="register-email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Your Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <EnvelopeIcon className="w-5 h-5 text-gray-500" />
          </div>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
            placeholder="name@gmail.com"
          />
        </div>
        <PasswordInputTag
          handleChange={handleChange}
          label={"Your Password"}
          name={"password"}
        />
        <PasswordInputTag
          label={"Confirm Your Password"}
          name={"confirmPassword"}
          handleChange={handleChange}
        />
        <button
          type="submit"
          className="mt-4 w-full text-white bg-green-500 p-2 rounded-lg"
        >
          Register
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
