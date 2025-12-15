import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useWorkFlowContextData } from "@/context/WorkFlowContext";
import { useNodesState, useReactFlow } from "reactflow";

const XMarkIcon = dynamic(import("@heroicons/react/24/outline/XMarkIcon"));
const ShareIcon = dynamic(import("@heroicons/react/24/outline/ShareIcon"));
const LinkIcon = dynamic(import("@heroicons/react/24/outline/LinkIcon"));

export default function DecisionButtonsTrigger() {
  const [formData, setFormData] = useState({
    subTriggers: [],
    responseText: "",
  });
  const { setNodes } = useReactFlow();
  const { isActiveBottomTRForm, nextActionDelayTime, setNextActionDelayTime } =
    useWorkFlowContextData();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubTriggerChange = (index, name, value) => {
    const newSubTriggers = [...formData.subTriggers];
    newSubTriggers[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      subTriggers: newSubTriggers,
    }));
  };

  const addSubTrigger = (type) => {
    if (formData.subTriggers.length < 3) {
      const newTrigger =
        type === "link" ? { type, label: "", url: "" } : { type, value: "" };
      setFormData((prevData) => ({
        ...prevData,
        subTriggers: [...prevData.subTriggers, newTrigger],
      }));
    }
  };

  const removeSubTrigger = (index) => {
    const newSubTriggers = formData.subTriggers.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      subTriggers: newSubTriggers,
    }));
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

    setNodes((nds) =>
      nds.map((node) =>
        node.id === isActiveBottomTRForm.id
          ? {
              ...node,
              data: {
                ...node.data,
                right_label:
                  formData?.subTriggers[0].type === "action"
                    ? formData?.subTriggers[0].value
                    : "",
                left_label:
                  formData?.subTriggers[1].type === "action"
                    ? formData?.subTriggers[1].value
                    : formData?.subTriggers?.length >= 3 &&
                      formData?.subTriggers[2].type === "action"
                    ? formData?.subTriggers[2].value
                    : "",
                message: formData,
                nextActionDelayTime,
              },
            }
          : node
      )
    );
    //console.log("Form Data:", formData);
  };

  useEffect(() => {
    const message = isActiveBottomTRForm?.activeNode?.data?.message;
    if (message && "subTriggers" in message) {
      setFormData(message);
    } else {
      setFormData({ ...message, subTriggers: [] });
    }
    setNextActionDelayTime(
      isActiveBottomTRForm?.activeNode?.data?.nextActionDelayTime
    );
  }, [isActiveBottomTRForm]);

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md">
      <div className="mb-2 relative w-full h-auto">
        <textarea
          name="responseText"
          value={formData?.responseText}
          onChange={handleResponseTextChange}
          placeholder="Enter response (max 280 characters)"
          maxLength="280"
          className="w-full p-2 border rounded"
          required
        />
        <div className="text-right text-xs text-gray-500">
          {formData?.responseText?.length}/280
        </div>
      </div>

      <div className="mb-2 w-full">
        {formData?.subTriggers?.map((trigger, index) => (
          <div key={index} className="mb-2 flex items-center relative w-full">
            {trigger.type === "link" ? (
              <>
                <input
                  type="text"
                  value={trigger.label}
                  onChange={(e) =>
                    handleSubTriggerChange(index, "label", e.target.value)
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
                    handleSubTriggerChange(index, "url", e.target.value)
                  }
                  placeholder={`Link URL ${index + 1}`}
                  className="w-full p-2 border rounded"
                />
              </>
            ) : (
              <input
                type="text"
                value={trigger.value}
                onChange={(e) =>
                  handleSubTriggerChange(index, "value", e.target.value)
                }
                placeholder={`Trigger ${index + 1}`}
                className="w-full p-2 border rounded"
              />
            )}
            <button
              type="button"
              onClick={() => removeSubTrigger(index)}
              className="text-red-500 bg-gray-200 absolute -right-10 top-1/2 -translate-y-1/2"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
        {formData?.subTriggers?.length < 3 && (
          <div className="mt-2 flex">
            <button
              disabled={
                formData?.subTriggers.filter((item) => item.type === "action")
                  .length >= 2
              }
              type="button"
              onClick={() => addSubTrigger("action")}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            >
              <ShareIcon className="w-5 h-5 rotate-90" />
              <span>Add Action</span>
            </button>
            <button
              type="button"
              onClick={() => addSubTrigger("link")}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            >
              <LinkIcon className="w-5 h-5" />
              <span>Add URL</span>
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="text-blue-700 w-full hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Submit
      </button>
    </form>
  );
}
