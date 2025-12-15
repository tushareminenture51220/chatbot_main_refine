// components/RegistrationForm.js
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import FormData from "form-data";
import { useAuth } from "@/context/AuthContext";
const PhotoIcon = dynamic(import("@heroicons/react/24/solid/PhotoIcon"));
import { toast } from "react-toastify";
import Loder from "./Loder";
import Image from "next/image";
const UserCircleIcon = dynamic(
  import("@heroicons/react/24/solid/UserCircleIcon")
);
const InformationCircleIcon = dynamic(
  import("@heroicons/react/24/solid/InformationCircleIcon")
);

const ProfileRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userImage: null,
    phoneNumber: "",
    companyName: "",
    companySlogan: "",
    region: "",
    agreedToTerms: false,
  });
  const [isloading, setIsLoading] = useState(false);
  const { authJWTToken, user, getDataFunc } = useAuth();
  const [showImg, setShowImg] = useState("");
  // console.log("authJWTToken", authJWTToken);
  //console.log(user);
  const handleChange = (event) => {
    const { name, value, type, checked, files, defaultValue } = event.target;
    if (name === "userImage") {
      if (type === "file" && files.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: files[0],
        }));
        setShowImg(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formData?.fullName && formDataToSend.append("fullName", formData.fullName);
    formData?.companyName &&
      formDataToSend.append("companyName", formData.companyName);
    formData?.companySlogan &&
      formDataToSend.append("companySlogan", formData.companySlogan);
    formData?.phoneNumber &&
      formDataToSend.append("phoneNumber", formData.phoneNumber);
    formData?.region && formDataToSend.append("region", formData.region);
    formData?.agreedToTerms &&
      formDataToSend.append("agreedToTerms", formData.agreedToTerms);
    formData?.userImage &&
      formDataToSend.append("userImage", formData.userImage);
    // console.log(Object.fromEntries(formDataToSend));
    setIsLoading(true);
    const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/auth/personal-details`;
    fetch(API_PATH, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authJWTToken}`,
      },
      body: formDataToSend,
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
          getDataFunc();
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
      {user.profile == false && (
        <div
          className="bg-teal-100 border-t-4 mb-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <InformationCircleIcon className="fill-current h-6 w-6 text-teal-500 mr-4" />
            </div>
            <div>
              <p className="font-bold"> Complete Your Profile</p>
              <p className="text-sm">
                Please complete your profile for a better experience
              </p>
            </div>
          </div>
        </div>
      )}
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="flex gap-2 items-center justify-start">
          <UserCircleIcon className="w-7 h-7 text-center" />
          <span className="text-lg text-center block text-gray-700 font-bold">
            Personal details
          </span>
        </div>

        <hr className="my-4" />
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Full Name
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              required
              placeholder="Enter Full Name"
              onChange={handleChange}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              id="inline-full-name"
              type="text"
              defaultValue={user.fullName}
              name="fullName"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
                htmlFor="inline-file-upload"
              >
                Your Picture
              </label>
            </div>
            <div className="md:w-2/3 flex items-center space-x-2">
              <label className="cursor-pointer relative">
                <div className="border-2 border-gray-300 hover:border-blue-200 rounded-full w-16 h-16 flex items-center justify-center">
                  {showImg ? (
                    <img
                      src={showImg}
                      alt="Selected"
                      className="max-h-16 max-w-16 object-contain rounded-full"
                    />
                  ) : user.userImage ? (
                    <img
                      src={user.userImage}
                      alt="Selected"
                      width={100}
                      height={100}
                      className="max-h-16 max-w-16 object-contain rounded-full"
                    />
                  ) : (
                    <PhotoIcon className="h-8 w-8 mx-auto text-gray-400 hover:text-blue-500" />
                  )}
                </div>
                <input
                  onChange={handleChange}
                  accept=".jpg, .jpeg, .png, .webp"
                  name="userImage"
                  type="file"
                  id="inline-file-upload"
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Comapny Name
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              required
              placeholder="Enter Company Name"
              onChange={handleChange}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              id="inline-full-name"
              type="text"
              defaultValue={user.companyName}
              name="companyName"
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Comapny Slogan
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              required
              placeholder="Enter Company Slogan"
              onChange={handleChange}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              id="inline-full-name"
              type="text"
              defaultValue={user.companySlogan}
              name="companySlogan"
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Phone Number
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              required
              onChange={handleChange}
              placeholder="Enter a 10-digit phone number"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              id="inline-full-name"
              type="number"
              name="phoneNumber"
              defaultValue={user.phoneNumber}
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
              htmlFor="region"
            >
              Region
            </label>
          </div>
          <div className="md:w-2/3">
            <select
              required
              onChange={handleChange}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              id="region"
              value={formData?.region}
              name="region"
            >
              {user.region && (
                <option value="default" selected disabled>
                  {user.region}
                </option>
              )}
              <option value="">Select Region</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3"></div>
          <label className="md:w-2/3 block text-gray-500 font-bold">
            <input
              required
              onChange={handleChange}
              name="agreedToTerms"
              className="mr-2 leading-tight"
              type="checkbox"
            />
            <span className="text-sm">Accept Terms and conditions</span>
          </label>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>

      {isloading && <Loder />}
    </>
  );
};
export default ProfileRegistrationForm;
