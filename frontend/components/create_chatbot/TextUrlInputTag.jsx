import React, { useState } from "react";
import dynamic from "next/dynamic";
const XCircleIcon = dynamic(import("@heroicons/react/24/solid/XCircleIcon"));
const LinkIcon = dynamic(import("@heroicons/react/24/solid/LinkIcon"));
const TextUrlInputTag = ({
  formData,
  setFormData,
  handleRemoveValueUrlLabels,
  placeholderOne,
  placeholderTwo,
  labelValue,
  errors,
  optional,
  need,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [inputLink, setInputLink] = useState("");
  const handleAddValue = () => {
    if (inputValue.trim() !== "") {
      const newURLLable = {
        label: inputValue,
        link: inputLink,
      };
      setFormData({
        ...formData,
        urlLabels: [...formData.urlLabels, newURLLable],
      });
      setInputValue("");
      setInputLink("");
    } else {
      alert("Add text for the trigger");
    }
  };

  return (
    <>
      <div className="md:flex md:items-center mb-4 animate-fade-up">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-full-name"
          >
            {labelValue}
            <br />
            {optional && (
              <>
                <span className="text-sm">(optional)</span>
              </>
            )}
          </label>
        </div>
        <div className={`md:w-2/3 ${need && "-ml-7"}`}>
          <div
            className={`flex items-center border-b border-teal-500 py-2 gap-0`}
          >
            <div className="flex justify-between items-center">
              <input
                onChange={(e) => setInputValue(e.target.value)}
                className="w-1/2 appearance-none bg-transparent border-none text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder={placeholderOne}
                aria-label="label"
                value={inputValue}
              />
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <LinkIcon className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  onChange={(e) => setInputLink(e.target.value)}
                  type="text"
                  id="input-group-1"
                  className=" text-blue-500 bg-gray-50 border-none border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  placeholder={placeholderTwo}
                  value={inputLink}
                />
              </div>
            </div>
            <button
              onClick={handleAddValue}
              className="flex bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="button"
            >
              add
            </button>
          </div>
          {errors?.suggestedTrigger && (
            <p className="text-red-500 m-1">{errors.suggestedTrigger}</p>
          )}
        </div>
      </div>

      <ul className="flex flex-wrap gap-2">
        {formData?.urlLabels?.map((elem, index) => (
          <li
            className="flex border border-teal-500 rounded-lg m-1 p-2 cursor-pointer gap-1"
            key={index}
          >
            <div className="relative">
              <span className="text-tooltip" title={elem.link}>
                {elem.label}
              </span>
            </div>
            <XCircleIcon
              className="w-5 h-5 text-red-500 mt-1"
              onClick={() => handleRemoveValueUrlLabels(index)}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default TextUrlInputTag;
