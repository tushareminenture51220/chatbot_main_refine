import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const PhotoIcon = dynamic(() =>
  import("@heroicons/react/24/outline/PhotoIcon")
);
const XMarkIcon = dynamic(() =>
  import("@heroicons/react/24/outline/XMarkIcon")
);

const WFSliderImageTag = ({ formData, setFormData }) => {
  const [showImg, setShowImg] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("image", file);

    setIsLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_EMBOT_API}/img/uploadImage`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setShowImg(data.imageURL);
        setImageId(data.imageId);
        setFormData((prevData) => ({
          ...prevData,
          imageURL: data.imageURL,
          imageId: data.imageId,
        }));
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteImage = () => {
    fetch(`${process.env.NEXT_PUBLIC_EMBOT_API}/img/deleteImage/${imageId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // console.log("Image deleted successfully");
          setShowImg(null);
          setImageId(null);
          setFormData((prevData) => ({
            ...prevData,
            imageURL: null,
            imageId: null,
          }));
        } else {
          console.error("Failed to delete image");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  useEffect(() => {
    if (formData?.imageURL && formData?.imageId) {
      setShowImg(formData?.imageURL);
      setImageId(formData?.imageId);
    }
  }, [formData]);

  return (
    <>
      <div className={`md:flex md:items-center animate-fade-up`}>
        <div className="md:w-full px-2 py-4 rounded-lg border-2 border-dashed border-blue-400 grid place-items-center relative">
          {!showImg ? (
            <label className="block gap-2 justify-center items-center">
              <div className="grid place-items-center">
                {isLoading ? (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-gray-200 animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                ) : (
                  <PhotoIcon className="h-8 w-8 mx-auto text-gray-400 hover:text-blue-500" />
                )}

                <p className="text-xs text-gray-500 mt-2">
                  SVG, PNG, JPG, JPEG or WEBP
                </p>
              </div>
              <div className="bg-white rounded-sm shadow-sm">
                <input
                  onChange={handleChange}
                  type="file"
                  accept=".jpg, .jpeg, .png, .webp"
                  name="responseImage"
                  className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>
            </label>
          ) : (
            <div className="relative group">
              <Image
                alt="Selected"
                src={showImg}
                width={100}
                height={100}
                className="h-full object-cover"
              />
              <button
                onClick={deleteImage}
                className="absolute top-0 -right-14 opacity-0 group-hover:opacity-100 bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-red-400 transition-opacity"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WFSliderImageTag;
