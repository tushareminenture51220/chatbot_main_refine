import React, { useState } from "react";
import dynamic from "next/dynamic";
const XCircleIcon = dynamic(import("@heroicons/react/24/solid/XCircleIcon"));
const SubtriggerInput = ({
  formData,
  setFormData,
  handleRemoveValue,
  placeholder,
  labelValue,
  errors,
  optional,
  need,
}) => {
  const [inputValue, setInputValue] = useState("");
  const handleAddValue = () => {
    if (inputValue.trim() !== "") {
      setFormData({
        ...formData,
        suggestedTrigger: [...formData.suggestedTrigger, inputValue],
      });
      setInputValue("");
    } else {
      alert("Add Triggers");
    }
  };

  return (
    <>
      <div
        className={`md:flex md:items-center animate-fade-up ${
          need ? "m-0" : "mb-4"
        }`}
      >
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
        <div className="md:w-2/3">
          <div className="flex items-center border-b border-teal-500 py-2">
            <input
              onChange={(e) => setInputValue(e.target.value)}
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder={placeholder}
              aria-label="triggers"
              value={inputValue}
            />
            <button
              onClick={handleAddValue}
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="button"
            >
              add
            </button>
          </div>
          {errors.suggestedTrigger && (
            <p className="text-red-500 m-1">{errors.suggestedTrigger}</p>
          )}
        </div>
      </div>
      <ul className={`flex flex-wrap gap-1 ${need && "mb-2"}`}>
        {formData.suggestedTrigger?.map((elem, index) => (
          <li
            className="border border-teal-500 rounded-lg m-1 p-1 flex items-center justify-between gap-1 cursor-pointer"
            key={index}
          >
            <span>{elem}</span>
            <XCircleIcon
              className="w-5 h-5 text-red-500"
              onClick={() => handleRemoveValue(index)}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default SubtriggerInput;
