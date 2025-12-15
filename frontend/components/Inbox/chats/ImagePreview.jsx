// components/ImagePreview.js

import React from "react";

const ImagePreview = ({ isOpenPreview, imgUrl, onClose }) => {
  return isOpenPreview ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-black bg-opacity-50 absolute inset-0"
        onClick={onClose}
      ></div>
      <div className="max-w-screen-sm mx-4 bg-white rounded-lg overflow-hidden">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white text-lg hover:text-gray-300 focus:outline-none"
          >
            &#x2715;
          </button>
          <img src={imgUrl} alt="Preview" className="w-full rounded-t-lg" />
        </div>
      </div>
    </div>
  ) : null;
};

export default ImagePreview;
