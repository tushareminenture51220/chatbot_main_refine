import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
const InformationCircleIcon = dynamic(
  import("@heroicons/react/24/solid/InformationCircleIcon")
);
const SliderForPreviewMulRes = ({ data }) => {
  useEffect(() => {
    if (data?.length == 0) {
      data = localStorage.getItem("multpleResponse");
    }
  }, [data]);
  // const data = [];
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <InformationCircleIcon className="w-16 h-16 text-gray-500 mb-4" />
          <p className="text-gray-600 mb-2">
            No data available. Add some trigger response data.
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="px-2 py-1">
        <Splide aria-label="services slider">
          {data?.map((elem, index) => (
            <SplideSlide key={index}>
              <div key={index}>
                <div className="w-full" key={index}>
                  {elem?.attachmentFile && (
                    <div className="w-full h-auto grid place-items-center rounded-md overflow-hidden">
                      <img
                        className="w-full h-auto"
                        src={elem?.attachmentFile}
                      />
                    </div>
                  )}
                  <div className="w-full">
                    <h3 className="text-md font-semibold my-1">
                      {elem?.title}
                    </h3>
                    <p className="text-justify">{elem?.responseMsg}</p>
                    <ul className="flex flex-wrap place-items-center gap-4">
                      {elem?.urlLabels?.map((item, index) => (
                        <li className="" key={index}>
                          <Link
                            title={item?.link}
                            href={item?.link}
                            className="text-md text-blue-500 font-semibold underline"
                          >
                            {item?.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
        <style>{`
          .splide__arrow--prev {
            left: -34px;
          }
          .splide__arrow--next {
            right: -34px;
          }
        `}</style>
      </div>
    );
  }
};

export default SliderForPreviewMulRes;
