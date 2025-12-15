import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import WFSliderImageTag from "./WFSliderImageTag";
import { v4 as uuidv4 } from "uuid";
import { useReactFlow } from "reactflow";
import { useWorkFlowContextData } from "@/context/WorkFlowContext";
const XMarkIcon = dynamic(import("@heroicons/react/24/outline/XMarkIcon"));
const ShareIcon = dynamic(import("@heroicons/react/24/outline/ShareIcon"));
const LinkIcon = dynamic(import("@heroicons/react/24/outline/LinkIcon"));

export default function WFSliderTriggerForm({
  mainData,
  setMainData,
  idx,
  setEvent,
}) {
  const [formData, setFormData] = useState({ subTriggers: [] });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubTriggerChange = (index, name, value, type) => {
    if (type === "link") {
      const newSubTriggers = [...formData?.subTriggers];
      newSubTriggers[index][name] = value;
      setFormData((prevData) => ({
        ...prevData,
        subTriggers: newSubTriggers,
      }));
    } else {
      const newSubTriggers = [...mainData.subTriggers];
      newSubTriggers[index][name] = value;
      setMainData((prevData) => ({
        ...prevData,
        subTriggers: newSubTriggers,
      }));
    }
  };

  const addSubTrigger = (type) => {
    const linkCount = formData?.subTriggers?.filter(
      (t) => t.type === "link"
    ).length;
    const actionCount = mainData.subTriggers?.filter(
      (t) => t.type === "action"
    ).length;

    if (type === "link" && linkCount < 2) {
      setFormData((prevData) => ({
        ...prevData,
        subTriggers: [...prevData.subTriggers, { type, label: "", url: "" }],
      }));
    } else if (type === "action" && actionCount < 2) {
      setMainData((prevData) => ({
        ...prevData,
        subTriggers: [...prevData.subTriggers, { type, value: "" }],
      }));
    }
  };

  const removeSubTrigger = (index, type) => {
    if (type === "link") {
      const newSubTriggers = formData?.subTriggers?.filter(
        (_, i) => i !== index
      );
      setFormData((prevData) => ({
        ...prevData,
        subTriggers: newSubTriggers,
      }));
    } else {
      const newSubTriggers = mainData.subTriggers?.filter(
        (_, i) => i !== index
      );
      setMainData((prevData) => ({
        ...prevData,
        subTriggers: newSubTriggers,
      }));
    }
  };

  const handleResponseTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= 280) {
      setFormData((prevData) => ({
        ...prevData,
        responseText: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let key = idx;
    setEvent("submit");
    setMainData((prevData) => ({ ...prevData, [key]: formData }));

    //console.log("formData", formData);
  };

  useEffect(() => {
    const keys = mainData && Object.keys(mainData);
    const numericKeys = keys.filter(
      (key) => !isNaN(key) && key !== "subTriggers"
    );

    // Check if there's greater thatn one numeric key
    const hasSingleNumericKey = numericKeys.length >= 1;

    if (hasSingleNumericKey) {
      if (mainData[idx] && "subTriggers" in mainData[idx]) {
        setFormData(mainData[idx]);
      } else {
        setFormData({ ...mainData[idx], subTriggers: [] });
      }

      // const idx = numericKeys[0];
      // Perform actions if there's only one numeric key in mainData
    }
  }, [mainData]);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded shadow-md w-full h-auto"
    >
      <div className="relative animate-fade-up">
        <div className="mb-2 relative w-full h-auto">
          <WFSliderImageTag formData={formData} setFormData={setFormData} />
        </div>
        <div className="mb-2 relative w-full h-auto">
          <input
            className="w-full p-2 border rounded"
            placeholder="Title"
            name="title"
            onChange={handleInputChange}
            maxLength={60}
            value={formData?.title}
          />
        </div>
        <div className="mb-2 relative w-full h-auto">
          <textarea
            name="descriptionText"
            value={formData?.responseText}
            onChange={handleResponseTextChange}
            placeholder="Enter description text (max 280 characters)"
            maxLength="280"
            className="w-full p-2 border rounded"
          />
          <div className="text-right text-xs text-gray-500">
            {formData?.responseText?.length || 0}/280
          </div>
        </div>
        <div className="mb-2 w-full h-auto">
          {formData?.subTriggers?.map((trigger, index) => (
            <div key={index} className="mb-2 flex items-center relative w-full">
              {trigger.type === "link" ? (
                <>
                  <input
                    type="text"
                    value={trigger.label}
                    onChange={(e) =>
                      handleSubTriggerChange(
                        index,
                        "label",
                        e.target.value,
                        "link"
                      )
                    }
                    name="label"
                    placeholder={`Link Label ${index + 1}`}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="url"
                    value={trigger.url}
                    onChange={(e) =>
                      handleSubTriggerChange(
                        index,
                        "url",
                        e.target.value,
                        "link"
                      )
                    }
                    placeholder={`Link URL ${index + 1}`}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubTrigger(index, "link")}
                    className="text-red-500 bg-gray-200 absolute -right-2 top-1/2 -translate-y-1/2"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </>
              ) : null}
            </div>
          ))}
          {mainData?.subTriggers?.map((trigger, index) => (
            <div key={index} className="mb-2 flex items-center relative w-full">
              {trigger.type === "action" ? (
                <>
                  <input
                    type="text"
                    value={trigger.value}
                    onChange={(e) =>
                      handleSubTriggerChange(
                        index,
                        "value",
                        e.target.value,
                        "action"
                      )
                    }
                    placeholder={`Trigger ${index + 1}`}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubTrigger(index, "action")}
                    className="text-red-500 bg-gray-200 absolute -right-2 top-1/2 -translate-y-1/2"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </>
              ) : null}
            </div>
          ))}
          <div className="mt-2 flex">
            {formData?.subTriggers?.filter((t) => t.type === "link").length <
              2 && (
              <button
                type="button"
                onClick={() => addSubTrigger("link")}
                className="flex items-center justify-center gap-2 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              >
                <LinkIcon className="w-5 h-5" />
                <span className="whitespace-nowrap overflow-visible">
                  Add URL
                </span>
              </button>
            )}
            {mainData.subTriggers?.filter((t) => t.type === "action").length <
              2 && (
              <button
                type="button"
                onClick={() => addSubTrigger("action")}
                className="flex items-center justify-center gap-2 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              >
                <ShareIcon className="w-5 h-5 rotate-90" />
                <span className="whitespace-nowrap overflow-visible">
                  Add Action
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="text-blue-700 w-full hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Save Data
      </button>
    </form>
  );
}
