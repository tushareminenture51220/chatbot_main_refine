import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import { useWorkFlowContextData } from "@/context/WorkFlowContext";
import { useReactFlow } from "reactflow";
import WFImageInputTag from "./set_response_trigger/WFImageInputTag";
import WFLinkComponent from "./set_response_trigger/WFLinkComponent";
import WFTextAreaTagWithEmojies from "./set_response_trigger/WFTextAreaTagWithEmojies";
import ChatwithAssistantForm from "./chatWithAssistantTrigger/ChatwithAssistantForm";

const PlusCircleIcon = dynamic(() =>
  import("@heroicons/react/24/solid/PlusCircleIcon")
);

const DocumentTextIcon = dynamic(() =>
  import("@heroicons/react/24/solid/DocumentTextIcon")
);
const PhotoIcon = dynamic(() => import("@heroicons/react/24/solid/PhotoIcon"));
const TrashIcon = dynamic(() => import("@heroicons/react/24/solid/TrashIcon"));
const LinkIcon = dynamic(() => import("@heroicons/react/24/solid/LinkIcon"));

const OutOfFlowTriggerComponent = () => {
  const [showFieldsOptions, setShowFieldsOptions] = useState(false);
  const [formData, setFormData] = useState({});
  const [tags, setTags] = useState([]);
  const { setOutOfFlowData, outOfFlowData } = useWorkFlowContextData();
  const { setNodes } = useReactFlow();
  const [activeSubForm, setActiveSubForm] = useState("messageForm");
  const [assiWaitingTimeAndMessage, setAssiWaitingTimeAndMessage] = useState({
    min: 0,
    sec: 0,
    assistantWaitingMessage: "",
  });
  const addTag = (tagsType) => {
    setTags((prevTags) => [...prevTags, { id: uuidv4(), tagsType }]);
  };
  const deleteImage = (imageId) => {
    // console.log(imageId, "imageID");
    fetch(`${process.env.NEXT_PUBLIC_EMBOT_API}/img/deleteImage/${imageId}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log("Image deleted successfully!!", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const removeTag = (id, index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tag?"
    );
    if (confirmDelete) {
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
      setFormData((prevData) => {
        const newData = { ...prevData };
        delete newData[index];
        return newData;
      });
      setFormData((prevData) => {
        // Create a copy of previous state
        const newData = { ...prevData };
        // Delete the specific index from the copy
        delete newData[index];
        // Create an array of valid entries
        const formDataUpdated = Object.keys(newData).map((key) => ({
          ...newData[key],
        }));
        return formDataUpdated; // Return the updated state
      });
    }
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [name]: value,
      },
    }));
  };

  // console.log(tags);
  const handleSubmit = (e) => {
    e.preventDefault();
    setNodes((prevNodes) => [...prevNodes]);
    setOutOfFlowData(formData);
    // console.log("Form Data:", formData);
  };

  const handleChangeTimer = (e) => {
    const { name, value } = e.target;
    setAssiWaitingTimeAndMessage((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmitTimer = (e) => {
    e.preventDefault();
    setNodes((prevNodes) => [...prevNodes]);
    setOutOfFlowData((prevData) => ({
      ...prevData,
      assiWaitingTimeAndMessage,
    }));
  };

  useEffect(() => {
    if (outOfFlowData) {
      const newTags = Object.keys(outOfFlowData)
        .map((key) => {
          const item = outOfFlowData[key];
          // console.log(key, item, "Key-item");
          if (item.responseText) {
            return {
              id: uuidv4(),
              tagsType: "textTags",
              responseText: item.responseText,
            };
          } else if (item.imageURL && item.imageId) {
            return {
              id: uuidv4(),
              tagsType: "imageTags",
              imageURL: item.imageURL,
              imageId: item.imageId,
            };
          } else if (item.label && item.url) {
            return {
              id: uuidv4(),
              tagsType: "linkTags",
              label: item.label,
              url: item.url,
            };
          }
          return null;
        })
        .filter(Boolean);

      setTags(newTags);

      const formDataArray = Object.keys(outOfFlowData).map((key) => ({
        ...outOfFlowData[key],
      }));

      setFormData(formDataArray);
      outOfFlowData?.assiWaitingTimeAndMessage &&
        setAssiWaitingTimeAndMessage(outOfFlowData?.assiWaitingTimeAndMessage);
    }
    console.log("outOfFlowData", outOfFlowData);
  }, [outOfFlowData]);

  return (
    <>
      <div className="px-2 overflow-x-hidden">
        <span className="font-semibold whitespace-nowrap">
          Action : Out of Flow Trigger
        </span>
        <hr className="mt-2" />
        <h4 className="font-semibold my-1">How it works </h4>
        <p className="mt-0 mb-2 font-normal text-sm leading-4 tracking-tight pt-2 pb-0 text-[#647491]">
          An "out of flow" trigger activates a predefined response for
          unexpected or off-topic user inputs, ensuring smooth handling of
          conversations. Additionally, if user go out of flow, they will be
          connected to a live agent for real-time assistance.
        </p>
        <div
          className="grid max-w-xs grid-cols-2 gap-1 p-1 mx-auto my-3 bg-gray-100 rounded-lg"
          role="group"
        >
          <button
            onClick={() => setActiveSubForm("messageForm")}
            type="button"
            className={`${
              activeSubForm == "messageForm"
                ? "bg-gray-900 text-white"
                : "bg-red text-gray-900"
            } px-5 py-1.5 text-xs font-medium rounded-lg`}
          >
            Message Form
          </button>
          <button
            onClick={() => setActiveSubForm("timerForm")}
            type="button"
            className={`${
              activeSubForm == "timerForm"
                ? "bg-gray-900 text-white"
                : "bg-red text-gray-900"
            } px-5 py-1.5 text-xs font-medium rounded-lg`}
          >
            Timer Form
          </button>
        </div>
        <span className="font-semibold my-1">Setup </span>
      </div>

      {activeSubForm == "messageForm" ? (
        <form className="w-full h-full mt-2 px-4" onSubmit={handleSubmit}>
          <div className="w-full relative">
            {tags?.map((tag, index) => (
              <div key={tag.id}>
                {tag.tagsType === "textTags" ? (
                  <WFTextAreaTagWithEmojies
                    tag={tag}
                    setFormData={setFormData}
                    formData={formData}
                    index={index}
                    removeTag={removeTag}
                    handleChange={handleChange}
                  />
                ) : tag.tagsType === "imageTags" ? (
                  <div className="group mb-2 relative">
                    <WFImageInputTag
                      index={index}
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <button
                      type="button"
                      className="group-hover:block hidden absolute top-1/2 -right-5 -translate-y-1/2"
                      onClick={() => removeTag(tag.id, index)}
                    >
                      <TrashIcon className="text-red-400 w-5 h-4/5 group-hover-block" />
                    </button>
                  </div>
                ) : (
                  <div className="group mb-2 relative">
                    <WFLinkComponent
                      index={index}
                      handleChange={(e) => handleChange(e, index)}
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <button
                      type="button"
                      className="group-hover:block hidden absolute top-1/2 -right-5 -translate-y-1/2"
                      onClick={() => removeTag(tag.id, index)}
                    >
                      <TrashIcon className="text-red-400 w-5 h-4/5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowFieldsOptions(!showFieldsOptions)}
            disabled={tags.length === 5}
            className="w-full py-2 px-0 mt-2 grid place-items-center me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
          >
            <PlusCircleIcon className="w-7 h-7 text-blue-500" />
          </button>

          {showFieldsOptions && (
            <div className="grid place-items-center w-full">
              <div className="w-2/3 text-sm bg-white border border-gray-100 rounded-lg shadow-md">
                <div className="py-2 px-1 w-full text-gray-900 md:pb-4">
                  <ul className="space-y-1 w-full">
                    <li
                      onClick={() => {
                        addTag("textTags");
                        setShowFieldsOptions(false);
                      }}
                      className="flex px-1 py-2 gap-1 hover:bg-gray-100 w-full cursor-pointer"
                    >
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                      <button
                        type="button"
                        className="text-gray-500 hover:text-blue-600"
                      >
                        Text
                      </button>
                    </li>
                    <li
                      onClick={() => {
                        addTag("imageTags");
                        setShowFieldsOptions(false);
                      }}
                      className="flex px-1 py-2 gap-1 hover:bg-gray-100 w-full cursor-pointer"
                    >
                      <PhotoIcon className="w-6 h-6 text-gray-400" />
                      <button
                        type="button"
                        className="text-gray-500 hover:text-blue-600"
                      >
                        Images
                      </button>
                    </li>
                    <li
                      onClick={() => {
                        addTag("linkTags");
                        setShowFieldsOptions(false);
                      }}
                      className="flex px-1 py-2 gap-1 hover:bg-gray-100 w-full cursor-pointer"
                    >
                      <LinkIcon className="w-5 h-5 text-gray-400" />
                      <button
                        type="button"
                        className="text-gray-500 hover:text-blue-600"
                      >
                        Links
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="text-blue-700 w-full hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Submit
            </button>
          </div>
        </form>
      ) : (
        <ChatwithAssistantForm
          assiWaitingTimeAndMessage={assiWaitingTimeAndMessage}
          handleSubmit={handleSubmitTimer}
          handleChange={handleChangeTimer}
        />
      )}
    </>
  );
};

export default OutOfFlowTriggerComponent;
