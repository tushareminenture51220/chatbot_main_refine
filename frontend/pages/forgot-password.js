import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import { Inter } from "next/font/google";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
const ChangePassword = dynamic(import("@/components/ChangePassword"));
const Loder = dynamic(import("@/components/Loder"));

const inter = Inter({ subsets: ["latin"] });
const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const { isAuthenticated } = useAuth();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(formData);
    const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/auth/forgot-password`;
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
          setShowOtpForm(true);
          setUserEmail(formData.email);
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
          className={`min-h-screen flex items-center justify-center bg-gray-100 mt-4 ${inter} relative`}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-center gap-4 md:w-[65%] w-[90%]">
            <div className="hidden md:flex md:w-1/2 md:justify-end">
              <Image
                src={require("../images/resetpassword.png")}
                alt="login Image"
                layout="responsive"
                className="w-full h-auto"
              />
            </div>
            {!showOtpForm ? (
              <div className="md:w-1/2">
                <p className="text-center text-sm font-sans m-4">
                  Feel free to proceed! Simply provide your email, and we will
                  dispatch reset password instructions to you.
                </p>
                <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
                  Forgot password
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      required
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-blue-500 w-full text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      Send me reset instructions
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <ChangePassword
                userEmail={userEmail}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setShowOtpForm={setShowOtpForm}
              />
            )}
          </div>

          {isLoading && <Loder />}
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
