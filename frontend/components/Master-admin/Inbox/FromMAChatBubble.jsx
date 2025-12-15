import Image from "next/image";
import React from "react";

const FromMAChatBubble = () => {
  return (
    <>
      <div className="flex items-start gap-2.5">
        <img
          className="w-8 h-8 rounded-full"
          src={
            "https://contacts.zoho.in/file?ID=60026684360&exp=6000&t=user&fs=original"
          }
          alt="Jese image"
          width={32} // Set width for optimization
          height={32} // Set height for optimization
        />
        <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900">
              Nitin Kadam
            </span>
            <span className="text-sm font-normal text-gray-500">11:46</span>
          </div>
          <p className="text-sm font-normal py-2.5 text-gray-900">
            That's awesome. I think our users will really appreciate the
            improvements.
          </p>
          <span className="text-sm font-normal text-gray-500">Delivered</span>
        </div>
      </div>
    </>
  );
};

export default FromMAChatBubble;
