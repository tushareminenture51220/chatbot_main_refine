import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import FormData from "form-data";
import { toast } from "react-toastify";
import { useChatBotData } from "@/context/ChatBotContest";
import TextUrlInputTag from "./TextUrlInputTag";
import SuggestedTriggersList from "./SuggestedTriggersList";
const MultipleValueInputTag = dynamic(import("./MultipleValueInputTag"));
const SubtriggerInput = dynamic(import("./SubtriggerInput"));
const ImgFileResponseInput = dynamic(import("./ImgFileResponseInput"));
const PencilSquareIcon = dynamic(
  import("@heroicons/react/24/solid/PencilSquareIcon")
);
const EditTriggerAndResponse = ({
  setShowEditForm,
  tRData,
  setIsLoading,
  authJWTToken,
}) => {
  const [errors, setErrors] = useState({});
  const [showEmojis, setShowEmojis] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [formData, setFormData] = useState({
    triggerText: [],
    responseMsg: "",
    suggestedTrigger: [],
    urlLabels: [],
    attachmentFile: null,
    initialResponse: false,
  });
  const { getChatBotData } = useChatBotData();
  const addEomoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => {
      codeArray.push("0x" + el);
    });
    let emoji = String.fromCodePoint(...codeArray);
    setFormData({ ...formData, responseMsg: formData.responseMsg + emoji });
  };
  const handleRemoveValue = (indexToRemove) => {
    const newTriggerText = formData.triggerText.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, triggerText: newTriggerText });
  };
  const handleRemoveValueSubTrigger = (indexToRemove) => {
    const newTriggerText = formData.suggestedTrigger.filter(
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

  const handleSubmit = (e) => {
    e.preventDefault();
    //validations
    // const validationResult = validateForm();
    // const { errors, isValid } = validationResult;
    // setErrors(errors);

    const formDataToSend = new FormData();
    formData?.triggerText &&
      formDataToSend.append(
        "triggerText",
        JSON.stringify(formData.triggerText)
      );
    formData?.responseMsg &&
      formDataToSend.append("responseMsg", formData.responseMsg);
    formData?.suggestedTrigger &&
      formDataToSend.append(
        "suggestedTrigger",
        JSON.stringify(formData.suggestedTrigger)
      );
    formData?.attachmentFile &&
      formDataToSend.append("attachmentFile", formData.attachmentFile);
    formData?.urlLabels &&
      formDataToSend.append("urlLabels", JSON.stringify(formData.urlLabels));
    formDataToSend.append("initialResponse", formData.initialResponse);
    // console.log("formDataToSend", Object.fromEntries(formDataToSend));

    setIsLoading(true);
    const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/chatbot/update-data/${tRData._id}`;
    fetch(API_PATH, {
      method: "PATCH",
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
          });
          setShowImg(null);
          setShowEditForm(false);
          getChatBotData(authJWTToken);
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
  };
  //console.log(formData);
  useEffect(() => {
    setShowImg(tRData.attachmentFile);
    setFormData({
      triggerText: tRData.triggerText,
      responseMsg: tRData.responseMsg,
      suggestedTrigger: tRData.suggestedTrigger,
      attachmentFile: tRData.attachmentFile,
      initialResponse: false,
      urlLabels: tRData.urlLabels,
    });
  }, [tRData]);
  return (
    <>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start w-full">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <PencilSquareIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-base font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      Edit Trigger & Response
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to edit Trigger & Response?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <form
                className="w-full flex overflow-x-hidden flex-col gap-1 md:gap-4 sm:gap-5 items-start justify-start pl-10"
                onSubmit={handleSubmit}
              >
                <MultipleValueInputTag
                  errors={errors}
                  labelValue={"Edit Triggers"}
                  placeholder={"Edit Triggers"}
                  handleRemoveValue={handleRemoveValue}
                  formData={formData}
                  setFormData={setFormData}
                  optional={false}
                  setErrors={setErrors}
                  need={false}
                />

                <div className="md:flex md:items-start">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
                      htmlFor="inline-full-name"
                    >
                      Set Response Message
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <div className="flex items-center border-b border-teal-500 py-2 relative">
                      <textarea
                        value={formData.responseMsg}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            responseMsg: e.target.value,
                          })
                        }
                        className=" appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
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
                          zIndex: 10000,
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
                  </div>
                </div>

                <ImgFileResponseInput
                  setFormData={setFormData}
                  formData={formData}
                  showImg={showImg}
                  setShowImg={setShowImg}
                />
                <SubtriggerInput
                  errors={errors}
                  labelValue={"Edit Suggestions"}
                  placeholder={"Edit Suggestions"}
                  handleRemoveValue={handleRemoveValueSubTrigger}
                  formData={formData}
                  setFormData={setFormData}
                  optional={true}
                  need={true}
                />
                <div className="-mt-5">
                  <TextUrlInputTag
                    labelValue={"Edit URL"}
                    placeholderOne={"Edit Label"}
                    placeholderTwo={"Add URL"}
                    optional={true}
                    errors={errors}
                    formData={formData}
                    setFormData={setFormData}
                    setErrors={setErrors}
                    handleRemoveValueUrlLabels={handleRemoveValueUrlLabels}
                    need={true}
                  />
                </div>
                <div className="bg-gray-50 w-full px-0 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setShowEditForm(false)}
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTriggerAndResponse;
