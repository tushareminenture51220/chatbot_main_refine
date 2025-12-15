import { useWorkFlowContextData } from "@/context/WorkFlowContext";
import React, { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import ChatwithAssistantForm from "./ChatwithAssistantForm";

const ChatWithAssistant = () => {
  const [assiWaitingTimeAndMessage, setAssiWaitingTimeAndMessage] = useState({
    min: 0,
    sec: 0,
    assistantWaitingMessage: "",
  });
  const { setNodes } = useReactFlow();
  const { isActiveBottomTRForm } = useWorkFlowContextData();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssiWaitingTimeAndMessage((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setNodes((nds) =>
      nds.map((node) =>
        node.id === isActiveBottomTRForm.id
          ? {
              ...node,
              data: { ...node.data, message: assiWaitingTimeAndMessage },
            }
          : node
      )
    );
   // console.log("assiWaitingTimeAndMessage", assiWaitingTimeAndMessage);
  };

  useEffect(() => {
    setAssiWaitingTimeAndMessage(
      isActiveBottomTRForm?.activeNode?.data?.message
    );
  }, [isActiveBottomTRForm]);

  return (
    <ChatwithAssistantForm
      assiWaitingTimeAndMessage={assiWaitingTimeAndMessage}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
    />
  );
};

export default ChatWithAssistant;
