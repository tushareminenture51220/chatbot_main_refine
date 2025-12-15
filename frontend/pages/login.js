import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const Loder = dynamic(import("@/components/Loder"));
const EyeIcon = dynamic(import("@heroicons/react/24/outline/EyeIcon"));
const EyeSlashIcon = dynamic(
  import("@heroicons/react/24/outline/EyeSlashIcon")
);

const inter = Inter({ subsets: ["latin"] });

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value.trim(),
    });
  };

  const handleRedirect = () => {
    setTimeout(() => {
      window.location.href = "/auth/dashboard";
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/auth/login`;

    //console.log(formData);
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
        // console.log(data, "login");
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
          toast.success("Logged In successful. Redirecting to dashboard.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          localStorage.setItem("EM_Token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          handleRedirect();
          setFormData({
            email: "",
            password: "",
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
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="m-24">
          <h1 className="font-semibold text-lg">
            You are already logged in, click to redirect
            <Link href="/auth/dashboard" className="text-blue-500">
              {" Dashboard"}
            </Link>
          </h1>
        </div>
      ) : (
        <div
          className={`min-h-screen flex items-center justify-center bg-gray-100 mt-4 ${inter}`}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-center gap-4 md:w-[65%] w-[90%]">
            <div className="hidden md:flex md:w-1/2 md:justify-end">
              <Image
                src={require("../images/ai2.jpg")}
                alt="login Image"
                layout="responsive"
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 w-full">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
                Log In
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
                      id="password"
                      name="password"
                      placeholder="Enter password"
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
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-500 w-full text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Log In
                  </button>
                </div>

                <div className="text-center mt-10">
                  <Link
                    href="/forgot-password"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
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

export default LoginPage;
