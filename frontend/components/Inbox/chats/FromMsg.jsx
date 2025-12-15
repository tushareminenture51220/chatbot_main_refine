import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ImagePreview from "./ImagePreview";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
const ArrowDownTrayIcon = dynamic(
  import("@heroicons/react/24/outline/ArrowDownTrayIcon")
);
const FromMsg = ({
  letter,
  textMsg,
  attachmentFile,
  createdAt,
  assiMsgData,
  responsesData,
}) => {
  // console.log(createdAt, "createdAt");
  // console.log(attachmentFile, "attachmentFile");
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const handleClosePreview = () => {
    setIsOpenPreview(false);
  };
  function isImageFileName(filename) {
    // List of common image file extensions
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "svg",
      "webp",
      "avif",
    ];

    // Extract the file extension from the filename
    const parts = filename.split(".");
    const extension = parts[parts.length - 1].toLowerCase();

    // Check if the extension is in the list of image extensions
    return imageExtensions.includes(extension);
  }
  const handleDownload = () => {
    if (imageBlob) {
      const url = window.URL.createObjectURL(new Blob([imageBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "image.jpg");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  //  console.log(attachmentFile);
  const getBackgroundColor = (letter) => {
    const colors = [
      "rgb(255, 159, 0)",
      "rgb(0, 180, 108)",
      "rgb(34, 102, 221)",
      "rgb(255, 62, 47)",
      "rgb(104, 109, 224)",
      "rgb(196, 58, 34)",
      "rgb(0, 166, 153)",
      "rgb(19, 77, 173)",
      "rgb(255, 87, 34)",
      "rgb(63, 81, 181)",
      "rgb(255, 133, 0)",
      "rgb(0, 150, 136)",
      "rgb(13, 71, 161)",
      "rgb(255, 47, 60)",
      "rgb(83, 109, 254)",
    ];
    const letterCode = letter?.charCodeAt(0) - 65; // Assuming uppercase letters
    const colorIndex = letterCode % colors.length;
    return colors[colorIndex];
  };

  return (
    <>
      <div className="col-start-6 col-end-13 p-3 rounded-lg rounded-tl-none">
        <div className="flex items-center justify-start flex-row-reverse">
          <div
            style={{
              background:
                assiMsgData?.assistantImage?.length > 0
                  ? `url(${assiMsgData?.assistantImage})`
                  : getBackgroundColor(letter),
            }}
            className={`flex text-white items-center justify-center h-10 w-10 rounded-full flex-shrink-0 mainForImageProperty`}
          >
            <span
              className={`text-md text-center ${
                !assiMsgData?.assistantImage?.length > 0 ? "block" : "hidden"
              }`}
            >
              {letter}
            </span>
          </div>

          <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl rounded-tr-none">
            <div>{textMsg}</div>
            <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
              seen
            </div>
            {attachmentFile?.length > 0 && (
              <div className="w-28 h-auto relative group">
                {isImageFileName(attachmentFile) ? (
                  <img
                    src={attachmentFile}
                    width={125}
                    height={125}
                    className="group cursor-pointer"
                    onClick={() => setIsOpenPreview(true)}
                  />
                ) : (
                  <iframe
                    src={attachmentFile}
                    width="125px"
                    height="125px"
                    style={{ overflow: "hidden" }}
                  ></iframe>
                )}
                <div className="absolute bottom-0 right-0 w-7 h-7 group-hover:block hidden">
                  <button
                    onClick={() => handleDownload(attachmentFile)}
                    download
                    className="bg-white z-50 border border-gray-800 overflow-hidden w-6 h-6 p-1 flex place-items-center rounded-md"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-800 font-semibold" />
                  </button>
                </div>
              </div>
            )}
            {isOpenPreview && (
              <ImagePreview
                isOpenPreview={isOpenPreview}
                imgUrl={attachmentFile}
                onClose={handleClosePreview}
              />
            )}
            {responsesData?.length > 0 && (
              <div style={{ width: "400px" }}>
                <Splide aria-label="services slider">
                  {responsesData?.map((elem, index) => (
                    <SplideSlide key={index}>
                      <div className="p-4 bg-white rounded-lg shadow-md">
                        <div className="mb-4">
                          <img
                            src={elem?.attachmentFile}
                            alt="attachmentImage"
                            className="w-full rounded-md"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            {elem?.title}
                          </h3>
                          <p className="text-gray-700 mb-4">
                            {elem?.responseMsg}
                          </p>
                          {elem?.urlLabels.length > 0 &&
                            elem?.urlLabels?.map((item, index) => (
                              <div key={index} className="mb-2">
                                <button
                                  onClick={() =>
                                    window.open(item.link, "_blank")
                                  }
                                  className="text-blue-500 font-semibold underline"
                                >
                                  {item.label}
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                      <style>{`
                        .splide__arrow {
                          width: 40px;
                          height: 40px;
                          background-color: #ffffff;
                          border-radius: 50%;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                          transition: background-color 0.3s ease;
                          cursor: pointer;
                        }

                        .splide__arrow:hover {
                          background-color: #f0f0f0;
                        }

                        .splide__arrow img {
                          width: 20px;
                          height: 20px;
                        }

                        .splide__arrow--prev {
                          left: -28px;
                        }

                        .splide__arrow--next {
                          right: -28px;
                        }
                      `}</style>
                    </SplideSlide>
                  ))}
                </Splide>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .mainForImageProperty {
          background-position: center !important;
          background-size: cover !important;
          background-repeat: no-repeat !important;
        }
      `}</style>
    </>
  );
};

export default FromMsg;
