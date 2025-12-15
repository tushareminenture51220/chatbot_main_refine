import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import FormData from "form-data";
import TextUrlInputTag from "./TextUrlInputTag";
import { toast } from "react-toastify";
const MultipleValueInputTag = dynamic(import("./MultipleValueInputTag"));
const SubtriggerInput = dynamic(import("./SubtriggerInput"));
const ImgFileResponseInput = dynamic(import("./ImgFileResponseInput"));
const ChatBubbleBottomCenterTextIcon = dynamic(
  import("@heroicons/react/24/outline/ChatBubbleOvalLeftEllipsisIcon")
);
const PhotoIcon = dynamic(() => import("@heroicons/react/24/solid/PhotoIcon"));
const LinkIcon = dynamic(() => import("@heroicons/react/24/solid/LinkIcon"));
const LightBulbIcon = dynamic(() =>
  import("@heroicons/react/24/solid/LightBulbIcon")
);
const BarsArrowUpIcon = dynamic(() =>
  import("@heroicons/react/24/solid/BarsArrowUpIcon")
);

const TriggersResForm = ({
  botData,
  setBotData,
  setIsLoading,
  enableMultipleRes,
  setEnableMultipleRes,
  getChatBotData,
  authJWTToken,
  showST,
  setShowST,
  setFormData,
  formData,
  getparticularMultipleResponse,
}) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [errors, setErrors] = useState({});
  const [addFeild, setAddFeild] = useState({
    image: false,
    trigger: false,
    url: false,
  });
  const fromRef = useRef(null);
  const [showImg, setShowImg] = useState(null);
  const [hideTriggerTab, setHideTriggerTab] = useState(false);
  const [responseLimitletterCount, setResponseLimitletterCount] = useState(0);
  const handleRemoveValue = (indexToRemove) => {
    const newTriggerText = formData?.triggerText?.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, triggerText: newTriggerText });
  };
  const handleRemoveValueSubTrigger = (indexToRemove) => {
    const newTriggerText = formData?.suggestedTrigger?.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, suggestedTrigger: newTriggerText });
  };
  const handleRemoveValueUrlLabels = (indexToRemove) => {
    const updatedURLs = formData?.urlLabels?.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, urlLabels: updatedURLs });
  };
  const addEomoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => {
      codeArray.push("0x" + el);
    });
    let emoji = String.fromCodePoint(...codeArray);
    setFormData({ ...formData, responseMsg: formData.responseMsg + emoji });
  };
  const validateForm = () => {
    const newErrors = {};
    if (formData.triggerText.length == 0) {
      newErrors.triggerText = "Trigger is required";
    }

    if (!formData.responseMsg) {
      newErrors.responseMsg = "Response Message is required";
    }
    if (!formData.urlLabels) {
      newErrors.urlLabels = "Label & URL is required";
    }
    if (newErrors) {
      setErrors(newErrors);
    }

    return {
      errors: newErrors,
      isValid: formData?.multipleResponseDraftId
        ? true
        : Object.keys(newErrors).length === 0,
    };
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationResult = validateForm();
    const { errors, isValid } = validationResult;

    setErrors(errors);

    const formDataToSend = new FormData();
    formData?.triggerText &&
      formDataToSend.append(
        "triggerText",
        JSON.stringify(formData.triggerText)
      );
    formData?.responseMsg &&
      formDataToSend.append("responseMsg", formData.responseMsg);

    formData?.title && formDataToSend.append("title", formData.title);
    formData?.format && formDataToSend.append("format", formData.format);
    formData?.suggestedTrigger?.length > 0 &&
      formDataToSend.append(
        "suggestedTrigger",
        JSON.stringify(formData.suggestedTrigger)
      );
    formData?.attachmentFile &&
      formDataToSend.append("attachmentFile", formData.attachmentFile);
    formData?.urlLabels &&
      formDataToSend.append("urlLabels", JSON.stringify(formData.urlLabels));
    formDataToSend.append("commonData", formData.commonData);
    formDataToSend.append("initialResponse", formData.initialResponse);
    formData?.multipleResponseDraftId &&
      formDataToSend.append(
        "multipleResponseDraftId",
        formData.multipleResponseDraftId
      );

    console.log("formDataToSend", Object.fromEntries(formDataToSend));
    if (isValid) {
      setIsLoading(true);

      const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/chatbot/${
        enableMultipleRes ? "create-multiple-responses" : "create-data"
      }`;
      fetch(API_PATH, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authJWTToken}`,
        },
        body: formDataToSend,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setIsLoading(false);
          if (data.status == "error") {
            toast.error(data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
            toast.success(data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setFormData({
              ...formData,
              triggerText: [],
              responseMsg: "",
              suggestedTrigger: [],
              attachmentFile: null,
              urlLabels: [],
              multipleResponseDraftId: data._id,
            });
            setShowImg(null);
            getChatBotData(authJWTToken);
            window.location.reload();
            if (enableMultipleRes) {
              localStorage.setItem("MulResponseId", data._id);
              getparticularMultipleResponse(data._id);
            }
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error(error.message);
          toast.error(error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        });
    }
  };

  useEffect(() => {
    if (enableMultipleRes) {
      setAddFeild({ image: true, trigger: false, url: false });
      let multipleResponseDraftId = localStorage.getItem("MulResponseId");
      if (multipleResponseDraftId) {
        setFormData({ ...formData, multipleResponseDraftId });
        setHideTriggerTab(true);
      } else {
        setHideTriggerTab(false);
      }
    } else {
      setHideTriggerTab(false);
      setAddFeild({ image: false, trigger: false, url: false });
    }
  }, [enableMultipleRes]);

  return (
    <>
      <form
        className="w-full flex overflow-x-hidden flex-col gap-1 md:gap-4 sm:gap-5 items-start justify-center"
        onSubmit={handleSubmit}
        ref={fromRef}
      >
        <div className="w-full max-w-2xl relative">
          <div className="flex gap-2 items-center justify-start">
            <ChatBubbleBottomCenterTextIcon className="w-7 h-7 text-center" />
            <span className="text-lg text-center block text-gray-700 font-bold">
              Set Triggers & Response
            </span>
            <div className="bg-teal-100 rounded-lg p-1">
              <input
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer"
                type="checkbox"
                title={
                  enableMultipleRes
                    ? "Disable Multiple Response"
                    : "Enable Multiple Response"
                }
                role="switch"
                id="flexSwitchCheckDefault01"
                onChange={(e) => setEnableMultipleRes(e.target.checked)}
              />
            </div>

            {enableMultipleRes && (
              <select
                title="Select Format"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    format: e.target.value,
                  })
                }
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-md p-1"
              >
                <option value="slider">Select Format</option>
                <option value="slider">Slider (default)</option>
              </select>
            )}
          </div>

          <hr className="my-4" />
        </div>
        <div className="w-full max-w-lg">
          <div className="overflow-x-hidden overflow-y-auto h-auto pr-5 max-h-[58vh]">
            {!hideTriggerTab && (
              <div className="mb-6">
                <MultipleValueInputTag
                  errors={errors}
                  labelValue={"Add Triggers"}
                  placeholder={"Enter Triggers"}
                  handleRemoveValue={handleRemoveValue}
                  formData={formData}
                  setFormData={setFormData}
                  optional={false}
                  setErrors={setErrors}
                />
              </div>
            )}
            {enableMultipleRes && (
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
                    htmlFor="inline-full-name"
                  >
                    Title
                  </label>
                </div>
                <div className="md:w-2/3">
                  <div className="flex items-center border-b border-teal-500 py-2 relative">
                    <input
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder="Enter Title"
                      aria-label="triggers"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
                  htmlFor="inline-full-name"
                >
                  {enableMultipleRes
                    ? "Set Response Message / Description"
                    : "Set Response Message"}
                </label>
              </div>
              <div className="md:w-2/3 relative">
                <div className="flex items-center border-b border-teal-500 py-2 relative">
                  <textarea
                    onInput={(e) => {
                      setResponseLimitletterCount(e.target.value.length);
                    }}
                    value={formData.responseMsg}
                    onChange={(e) =>
                      setFormData({ ...formData, responseMsg: e.target.value })
                    }
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="text"
                    placeholder="Enter Response"
                    aria-label="triggers"
                    required
                  />
                  <span
                    onClick={() => setShowEmojis(!showEmojis)}
                    className={`absolute bottom-1 bg-white rounded-full p-1 right-0 cursor-pointer hover:text-blue-500 ${
                      showEmojis ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
                      />
                    </svg>
                  </span>
                </div>
                {showEmojis && (
                  <div
                    style={{
                      height: "350px",
                      borderBottomRightRadius: "10px",
                      borderBottomLeftRadius: "10px",
                    }}
                    className={`emogies-container fixed z-50 overflow-hidden animate-fade-down`}
                  >
                    <Picker
                      data={data}
                      emojiSize={20}
                      onEmojiSelect={addEomoji}
                      maxFrequentRows={0}
                      perLine={8}
                      previewPosition={"none"}
                    />
                  </div>
                )}
                {enableMultipleRes && (
                  <p
                    className={`absolute right-0 -bottom-6 ${
                      responseLimitletterCount > 180 && enableMultipleRes
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {responseLimitletterCount}/180
                  </p>
                )}
              </div>
            </div>

            {addFeild.url == true && (
              <div className="mb-6">
                <TextUrlInputTag
                  labelValue={"Add URL"}
                  placeholderOne={"Add Label"}
                  placeholderTwo={"Add URL"}
                  optional={true}
                  errors={errors}
                  formData={formData}
                  setFormData={setFormData}
                  setErrors={setErrors}
                  handleRemoveValueUrlLabels={handleRemoveValueUrlLabels}
                />
              </div>
            )}
            {addFeild.image == true && (
              <ImgFileResponseInput
                setFormData={setFormData}
                formData={formData}
                showImg={showImg}
                setShowImg={setShowImg}
                need={true}
                optional={enableMultipleRes ? false : true}
              />
            )}
            {addFeild.trigger == true && (
              <SubtriggerInput
                errors={errors}
                labelValue={"Add Suggestions"}
                placeholder={"Enter Suggestions"}
                handleRemoveValue={handleRemoveValueSubTrigger}
                formData={formData}
                setFormData={setFormData}
                optional={true}
              />
            )}
          </div>
          <br />
          <div className="w-full grid justify-end items-center ">
            <div className="py-2 w-fit flex justify-center items-start gap-2 bg-white rounded-lg shadow-sm">
              <div
                onClick={() =>
                  setAddFeild({ ...addFeild, image: !addFeild.image })
                }
                className="group hover:rounded-sm text-gray-500 hover:text-blue-500 px-4 py-1 cursor-pointer hover:bg-gray-50 "
              >
                <PhotoIcon className="w-7 h-7" />
                <div className="group-hover:block hidden absolute z-50 mt-6 -ml-6 bg-gray-500 rounded-lg text-white text-sm py-1 px-2">
                  {addFeild.image ? "Remove Image" : "Add Image"}
                </div>
              </div>

              <div
                onClick={() =>
                  setAddFeild({ ...addFeild, trigger: !addFeild.trigger })
                }
                className="group px-4 py-1 cursor-pointer text-gray-500  hover:bg-gray-50  hover:rounded-sm hover:text-blue-500"
              >
                <BarsArrowUpIcon className="w-7 h-7" />
                <div className="group-hover:block hidden absolute z-50 mt-6 -ml-10 bg-gray-500 rounded-lg text-white text-sm py-1 px-2">
                  {addFeild.trigger ? "Remove Suggestion" : "Add Suggestion"}
                </div>
              </div>

              <div>
                <button
                  disabled={
                    responseLimitletterCount > 180 && enableMultipleRes
                      ? true
                      : false
                  }
                  type="submit"
                  title={
                    responseLimitletterCount > 180 && enableMultipleRes
                      ? "Response must be at least 180 characters."
                      : "Submit the Trigger and Response"
                  }
                  className={`cursor-pointer bg-teal-400 text-white rounded-lg px-4 py-1 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {enableMultipleRes ? "Add" : "Submit"}
                </button>
              </div>

              <div
                onClick={() => setAddFeild({ ...addFeild, url: !addFeild.url })}
                className="group px-4 py-1 cursor-pointer text-gray-500  hover:bg-gray-50  hover:rounded-sm hover:text-blue-500"
              >
                <LinkIcon className="w-7 h-7" />
                <div className="group-hover:block hidden absolute z-50 mt-6 -ml-10 bg-gray-500 rounded-lg text-white text-sm py-1 px-2">
                  {addFeild.trigger ? "Remove URL" : "Add URL"}
                </div>
              </div>
              <div
                onClick={() => setShowST(!showST)}
                className={`group px-4 py-1 cursor-pointer  hover:bg-gray-50  hover:rounded-sm hover:text-orange-400 ${
                  showST ? "text-orange-400" : "text-gray-500"
                }`}
              >
                <LightBulbIcon className="w-7 h-7" />
                <div className="group-hover:block hidden absolute z-50 mt-6 -ml-10 bg-gray-500 rounded-lg text-white text-sm py-1 px-2">
                  See triggers Ideas
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default TriggersResForm;
