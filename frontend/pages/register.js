import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
const EyeIcon = dynamic(import("@heroicons/react/24/outline/EyeIcon"));
const EyeSlashIcon = dynamic(
  import("@heroicons/react/24/outline/EyeSlashIcon")
);
const Loder = dynamic(import("@/components/Loder"));

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    website: "",
    termsAndConditions: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must be 8+ characters with at least 1 lowercase, 1 uppercase, 1 number, and 1 special character (@$!%*?&).";
    }

    if (!formData.website) {
      newErrors.website = "Website is required";
    }

    if (!formData.termsAndConditions) {
      newErrors.termsAndConditions =
        "You must agrees to the Terms and Conditions";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRedirect = () => {
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/auth/sign-up`;
    // console.log(JSON.stringify(formData));
    if (validateForm()) {
      setIsLoading(true);
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
          // console.log(data);
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
            toast.success("Registration successful. Redirecting to Login.", {
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
              website: "",
              termsAndConditions: false,
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("There was a problem with the fetch operation:", error);
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
    <>
      {isAuthenticated ? (
        <div className="m-24">
          <h1 className="font-semibold text-lg">
            You are already logged in with your Register account, click to redirect
            <Link href="/auth/dashboard" className="text-blue-500">
              {" Dashboard"}
            </Link>
          </h1>
        </div>
      ) : (
        <div className="overflow-hidden min-h-screen flex items-center justify-center bg-gray-100 mt-4">
          <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-center gap-4 md:w-[65%] w-[90%]">
            <div className="hidden md:flex md:w-1/2 md:justify-end">
              <Image
                src={require("../images/hero-bg.webp")}
                alt="Registration Image"
                layout="responsive"
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
                Create your account
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-600 mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
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
                  <label className="block text-gray-600 mb-2" htmlFor="website">
                    Website
                  </label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    placeholder="Enter Website"
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 ${
                      errors.website ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.website && (
                    <p className="text-red-500 mt-1">{errors.website}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-600 mb-2"
                    htmlFor="termsAndConditions"
                  >
                    <input
                      type="checkbox"
                      id="termsAndConditions"
                      name="termsAndConditions"
                      checked={formData.termsAndConditions}
                      onChange={handleChange}
                      className="mr-2"
                      required
                    />
                    I agree to EMBot's Terms & Conditions and Privacy Policy
                  </label>
                  {errors.termsAndConditions && (
                    <p className="text-red-500 mt-1">
                      {errors.termsAndConditions}
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-500 w-full text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>

          {isLoading && <Loder />}
        </div>
      )}
    </>
  );
};

export default RegisterPage;
