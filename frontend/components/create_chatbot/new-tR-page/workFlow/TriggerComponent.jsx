import React, { useState } from "react";
import dynamic from "next/dynamic";
import ReactFlow, {
  Handle,
  NodeProps,
  Position,
  useReactFlow,
  useNodesState,
} from "reactflow";
import CustomeHandle from "./CustomeHandle";
import { useWorkFlowContextData } from "@/context/WorkFlowContext";
import { useAuth } from "@/context/AuthContext";
import SuggestedTriggersList from "../../SuggestedTriggersList";

// Dynamically import icons with ssr: false
const PencilSquareIcon = dynamic(
  () => import("@heroicons/react/24/solid/PencilSquareIcon"),
  { ssr: false }
);
const XMarkIcon = dynamic(() => import("@heroicons/react/24/solid/XMarkIcon"), {
  ssr: false,
});

const TriggerComponent = (props) => {
  // console.log("Props", props);
  const { data, id } = props;
  const { setNodes, setEdges } = useReactFlow();
  // const { deleteTREdgeORNode } = useWorkFlowContextData();
  const [showEditDeleteBtns, setShowEditDeleteBtns] = useState(false);
  // console.log("nodes", nodes);
  const {
    isActiveBottomTRForm,
    setIsActiveBottomTRForm,
    isOpenBottomSubMenusTR,
    setIsOpenBottomSubMenusTR,
  } = useWorkFlowContextData();

  const handleEditClick = () => {
    setIsActiveBottomTRForm((prev) => ({
      ...prev,
      status: true,
      id,
      activeNode: props,
    }));
  };

  const handleDeleteClick = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Trigger?"
    );
    if (confirmDelete) {
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.source !== id && edge.target !== id)
      );
      setIsActiveBottomTRForm((prev) => ({
        ...prev,
        status: false,
      }));
      // deleteTREdgeORNode("node", id);
    }
  };

  const handleButtonClick = () => {
    setShowEditDeleteBtns((prev) => !prev);
    data.triggerType != "triggers" &&
      setIsActiveBottomTRForm((prev) => ({
        ...prev,
        status: true,
        id,
        activeNode: props,
      }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Delete") {
      handleDeleteClick();
    }
  };

  const renderHandles = () => {
    if (data.triggerType === "triggers") {
      return (
        <CustomeHandle type="source" position={Position.Right} isConnectable />
      );
    }
    if (data.triggerType === "actions") {
      return (
        <>
          <CustomeHandle
            id="top-handle"
            type="target"
            position={Position.Top}
            isConnectable
          />
          {data.nodeHandles >= 2 && (
            <CustomeHandle
              type="source"
              id="right-handle"
              position={Position.Right}
              isConnectable
              decisiontrigger={data.decisiontrigger}
            />
          )}
          {data.nodeHandles >= 3 && (
            <CustomeHandle
              type="source"
              id="left-handle"
              position={Position.Left}
              isConnectable
              decisiontrigger={data.decisiontrigger}
            />
          )}
          {data.nodeHandles == 4 && (
            <CustomeHandle
              type="source"
              id="Bottom-handle"
              position={Position.Bottom}
              isConnectable
              decisiontrigger={data.decisiontrigger}
            />
          )}
        </>
      );
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center group align-middle">
      <button
        type="button"
        onKeyDown={(e) => handleKeyDown(e)}
        title="click for menu"
        onClick={handleButtonClick}
        className={`relative mb-2 align-middle border-4 border-white text-white bg-gradient-to-r rounded-full text-center w-16 h-16 grid items-center justify-center ${
          data.triggerType === "triggers"
            ? "from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50"
            : data.triggerType === "actions"
            ? "from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50"
            : "bg-orange-400"
        }`}
      >
        <div
          className="w-7 h-7"
          dangerouslySetInnerHTML={{ __html: data.iconName }}
        />
      </button>

      <p
        className={`z-10 group-hover:hidden block animate-fade-down absolute -bottom-11 w-max px-3 py-1.5 text-sm font-medium text-gray-800 rounded-lg shadow-sm duration-300 bg-white ${
          data.triggerType === "triggers" ? "mb-0" : "mb-2"
        }`}
      >
        {data.trigger_Name}
      </p>

      {showEditDeleteBtns && (
        <div className="z-10 mb-0 animate-fade-up absolute left-12 -top-8 w-max px-2 py-1 text-sm font-medium text-gray-800 rounded-lg shadow-sm duration-100 bg-white">
          <div className="flex justify-center items-center gap-2 relative z-[9999]">
            {data.triggerType != "triggers" && (
              <PencilSquareIcon
                onClick={() => handleEditClick(data, id)}
                className="w-5 h-5 text-black cursor-pointer transition-all relative z-50 hover:text-blue-500"
              />
            )}
            <XMarkIcon
              onClick={handleDeleteClick}
              className="w-5 h-5 hover:text-blue-500 transition-all text-black cursor-pointer relative z-50"
            />
          </div>
        </div>
      )}

      {renderHandles()}
    </div>
  );
};

export default TriggerComponent;
