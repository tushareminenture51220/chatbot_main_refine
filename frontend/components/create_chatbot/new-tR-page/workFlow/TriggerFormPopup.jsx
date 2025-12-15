import { useWorkFlowContextData } from "@/context/WorkFlowContext";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import DelayTrigger from "../delayTrigger/DelayTrigger";
import ChatWithAssistant from "../chatWithAssistantTrigger/ChatWithAssistant";
const WFSetTriggerResponseFrom = dynamic(
  import("../set_response_trigger/WFSetTriggerResponseFrom")
);
const DecisionButtonsTrigger = dynamic(
  import("../Decision-button/DecisionButtonsTrigger")
);
const ParentSLiderComponent = dynamic(
  import("../SliderTrigger/ParentSLiderComponent")
);
const EnableTextInput = dynamic(import("../Enable-text-input/EnableTextInput"));
const DisableTextInput = dynamic(
  import("../DisableTextInput/DisableTextInput")
);
const AskAQuestion = dynamic(import("../Questionalbleform/AskAQuestion"));
const CustomeForms = dynamic(import("../customeForm/CustomeForms"));
const XMarkIcon = dynamic(() => import("@heroicons/react/24/solid/XMarkIcon"));
const TriggerFormPopup = () => {
  const {
    isActiveBottomTRForm,
    setIsActiveBottomTRForm,
    nextActionDelayTime,
    setNextActionDelayTime,
  } = useWorkFlowContextData();

  const renderForms = () => {
    if (
      isActiveBottomTRForm.activeNode.data.triggerType == "actions" &&
      isActiveBottomTRForm.activeNode.data.trigger_Name == "Send a response"
    ) {
      return <WFSetTriggerResponseFrom />;
    } else if (
      isActiveBottomTRForm.activeNode.data.triggerType == "actions" &&
      isActiveBottomTRForm.activeNode.data.trigger_Name == "Decision (Buttons)"
    ) {
      return <DecisionButtonsTrigger />;
    } else if (
      isActiveBottomTRForm.activeNode.data.triggerType == "actions" &&
      isActiveBottomTRForm.activeNode.data.trigger_Name == "Card Slider"
    ) {
      return <ParentSLiderComponent />;
    } else if (
      isActiveBottomTRForm.activeNode.data.triggerType == "actions" &&
      isActiveBottomTRForm.activeNode.data.trigger_Name == "Enable text input"
    ) {
      return <EnableTextInput />;
    } else if (
      isActiveBottomTRForm.activeNode.data.triggerType == "actions" &&
      isActiveBottomTRForm.activeNode.data.trigger_Name == "Disable text input"
    ) {
      return <DisableTextInput />;
    } else if (
      isActiveBottomTRForm.activeNode.data.triggerType == "actions" &&
      isActiveBottomTRForm.activeNode.data.trigger_Name ==
        "Questionable Trigger"
    ) {
      return <AskAQuestion />;
    } else if (
      isActiveBottomTRForm.activeNode.data.triggerType == "actions" &&
      isActiveBottomTRForm.activeNode.data.trigger_Name == "Custom Forms"
    ) {
      return <CustomeForms />;
    } else if (
      isActiveBottomTRForm.activeNode.data.triggerType == "actions" &&
      isActiveBottomTRForm.activeNode.data.trigger_Name == "Chat with Assistant"
    ) {
      return <ChatWithAssistant />;
    }
  };

  return (
    <div
      style={{ height: "calc(100% - 88px)" }}
      className="fixed bottom-0 right-0 z-50 animate-fade-up bg-white p-4 border-t border-gray-200 w-[480px] overflow-y-auto"
    >
      <div className="flex w-full bg-white top-0 items-center justify-between mb-4 border-b rounded-t ">
        <div className="flex justify-start items-center gap-2 cursor-pointer p-2 h-auto w-full">
          <div className="w-9 h-9 bg-purple-500 text-white p-1 rounded-full">
            <div
              dangerouslySetInnerHTML={{
                __html: isActiveBottomTRForm.activeNode.data.iconName,
              }}
            />
          </div>
          <span className="text-sm whitespace-nowrap">
            {isActiveBottomTRForm.activeNode.data.triggerType} :
          </span>
          <span className="font-semibold whitespace-nowrap">
            {isActiveBottomTRForm.activeNode.data.trigger_Name}
          </span>
        </div>
        <button
          onClick={() => {
            setIsActiveBottomTRForm({ status: false });
          }}
          className={`mx-2 px-4 py-2 rounded-lg focus:outline-none`}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="relative">
        <div className="px-2">
          <span className="font-semibold my-1">How it works </span>
          <p className="mt-0 mb-2 font-normal text-sm leading-4 tracking-tight pt-2 pb-0 text-[#647491]">
            {isActiveBottomTRForm.activeNode.data.howItsWorksText}
          </p>
          <span className="font-semibold my-1">Setup </span>
        </div>
        <div className="px-2">
          <div className="bg-[#f8f9fc] mt-2 w-full py-6 px-8  rounded-md h-full">
            {renderForms()}
          </div>
          {isActiveBottomTRForm.activeNode.data.trigger_Name !==
            "Chat with Assistant" && (
            <DelayTrigger
              nextActionDelayTime={nextActionDelayTime}
              setNextActionDelayTime={setNextActionDelayTime}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TriggerFormPopup;
