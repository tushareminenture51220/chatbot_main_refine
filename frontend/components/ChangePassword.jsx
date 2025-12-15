import dynamic from "next/dynamic";
import React, { useState } from "react";
import OtpTimer from "./OtpTimer";
const EyeIcon = dynamic(import("@heroicons/react/24/outline/EyeIcon"), {
  ssr: false,
});
const EyeSlashIcon = dynamic(
  import("@heroicons/react/24/outline/EyeSlashIcon")
);
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const ChangePassword = ({
  userEmail,
  isLoading,
  setIsLoading,
  setShowOtpForm,
}) => {
  const [formData, setFormData] = useState({
    email: userEmail,
    password: "",
    otp: "",
    conformPassword: "",
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({});
  };
  function isPasswordValid(password) {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must be 8+ characters with at least 1 lowercase, 1 uppercase, 1 number, and 1 special character (@$!%*?&).";
    }
    if (!formData.otp) {
      newErrors.otp = "otp is required";
    } else if (formData.otp.length < 4) {
      newErrors.otp = "OTP must have 4 digits";
    }
    if (formData.password != formData.conformPassword) {
      newErrors.conformPassword = "Password Not match";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const handleRedirect = () => {
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPasswordValid(formData.password)) {
      setIsLoading(true);
      delete formData.conformPassword;
      const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/auth/change-password`;
      fetch(API_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setIsLoading(false);
          if (data.status == "error") {
            toast.error(data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
            toast.success(data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            handleRedirect();
            setFormData({
              email: "",
              password: "",
              otp: "",
              conformPassword: "",
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error catch", error);
          toast.error(error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        });
    }
  };
  return (
    <div className="md:w-1/2 fade-left w-full">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
        Change password
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300`}
            defaultValue={userEmail}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="password">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 ${
                errors.password ? "border-red-500" : ""
              }`}
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeIcon className="fas fa-eye-slash text-gray-500 w-5 h-5" />
              ) : (
                <EyeSlashIcon className="fas fa-eye text-gray-500 w-5 h-5" />
              )}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 mt-1">{errors.password}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="password">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              id="conformPassword"
              name="conformPassword"
              value={formData.conformPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 ${
                errors.conformPassword ? "border-red-500" : ""
              }`}
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeIcon className="fas fa-eye-slash text-gray-500 w-5 h-5" />
              ) : (
                <EyeSlashIcon className="fas fa-eye text-gray-500 w-5 h-5" />
              )}
            </span>
          </div>
          {errors.conformPassword && (
            <p className="text-red-500 mt-1">{errors.conformPassword}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="email">
            <OtpTimer setShowOtpForm={setShowOtpForm} />
          </label>
          <input
            type="number"
            id="otp"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300`}
            required
          />
          {errors.otp && <p className="text-red-500 mt-1">{errors.otp}</p>}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 w-full text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
