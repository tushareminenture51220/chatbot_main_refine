import { useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import debounce from "lodash.debounce";
import MainMenuTCA from "@/components/create_chatbot/new-tR-page/MainMenuTCA";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import "reactflow/dist/style.css";
import CustomeEdge from "./workFlow/CustomeEdge";
import TriggerComponent from "./workFlow/TriggerComponent";
import { initialEdges, initialNodes } from "./workFlow/Workflow.constants";
import BottomSubMenusTR from "./BottomSubMenusTR";
import { v4 as uuidv4 } from "uuid";
import TriggerFormPopup from "./workFlow/TriggerFormPopup";
import { useWorkFlowContextData } from "@/context/WorkFlowContext";
import { useAuth } from "@/context/AuthContext";

const CheckIcon = dynamic(import("@heroicons/react/24/solid/CheckIcon"));
const edgeTypes = {
  customeEdge: CustomeEdge,
};

const nodeTypes = {
  triggerComponent: TriggerComponent,
};
const FlowChartComponent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { userId } = useAuth();
  const {
    updateTRNodesAndEdges,
    isLoading,
    databaseEdges,
    databaseNodes,
    outOfFlowData,
  } = useWorkFlowContextData();
  const [activeTab, setActiveTab] = useState("triggers");
  const {
    isActiveBottomTRForm,
    setIsActiveBottomTRForm,
    isOpenBottomSubMenusTR,
    setIsOpenBottomSubMenusTR,
  } = useWorkFlowContextData();

  const onConnect = useCallback((connection) => {
    const sourceNode = nodes.find((node) => node.id === connection.source);

    // Determine the label based on the source node's data
    const handleType = connection.sourceHandle;
    let edgeLabel = "";
    if (handleType === "right-handle") {
      edgeLabel = sourceNode?.data?.right_label;
      //  console.log(sourceNode?.data?.right_label);
    } else if (handleType === "left-handle") {
      edgeLabel = sourceNode?.data?.left_label;
      //  console.log(sourceNode?.data?.left_label);
    }
    const edge = {
      ...connection,
      id: uuidv4(),
      type: "customeEdge",
      label: edgeLabel,
    };
    setEdges((prevEdges) => addEdge(edge, prevEdges));
    // Update the nodes state
    // setNodes(updatedNodes);
  });

  const saveDataFunc = () => {
    const connectedNodeIds = new Set();
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    // Step 2: Filter trNodes data to include only nodes that are in the connectedNodeIds set
    const filteredNodes = nodes.filter((node) => connectedNodeIds.has(node.id));

    // Step 3: Add the `connections` field to each filtered node
    filteredNodes.forEach((node) => {
      node.data.connections = {};
      edges.forEach((edge) => {
        if (edge.target === node.id) {
          if (!node.data.connections.leftTarget) {
            node.data.connections.leftTarget = edge.source;
          } else {
            node.data.connections.rightTarget = edge.source;
          }
        }
        if (edge.source === node.id) {
          if (!node.data.connections.leftSource) {
            node.data.connections.leftSource = edge.target;
          } else {
            node.data.connections.rightSource = edge.target;
          }
        }
      });
    });
    const payload = {
      adminId: userId,
      tRNodes: filteredNodes,
      tREdges: edges,
      outOfFlowData: outOfFlowData,
    };
    // console.log("payload", payload);
    updateTRNodesAndEdges(payload);
  };

  const debouncedSaveData = useCallback(
    debounce(() => {
      if (nodes?.length > 1 && edges?.length >= 1) {
        saveDataFunc();
      }
    }, 300),
    [nodes, edges]
  );
  useEffect(() => {
    debouncedSaveData();

    return () => {
      debouncedSaveData.cancel();
    };
  }, [nodes, edges, debouncedSaveData]);

  // useEffect(() => {
  //   console.log("nodes", nodes);
  // }, [nodes]);
  useEffect(() => {
    if (databaseEdges?.length >= 1 && databaseNodes?.length >= 2) {
      setEdges(databaseEdges);
      setNodes(databaseNodes);
    }
  }, [databaseEdges, databaseNodes, nodes, edges]);

  return (
    <div className="w-full h-[85vh] overflow-y-auto relative border-1 border-gray-500">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background variant="dots" />
        <div className="w-auto relative z-50">
          {isOpenBottomSubMenusTR ? (
            <BottomSubMenusTR
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsOpenBottomSubMenusTR={setIsOpenBottomSubMenusTR}
            />
          ) : (
            <MainMenuTCA
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsOpenBottomSubMenusTR={setIsOpenBottomSubMenusTR}
            />
          )}
          {isActiveBottomTRForm.status && (
            <TriggerFormPopup
              setIsActiveBottomTRForm={setIsActiveBottomTRForm}
              isActiveBottomTRForm={isActiveBottomTRForm}
            />
          )}
          <button
            onClick={() => saveDataFunc()}
            type="button"
            className="py-2.5 px-5 mt-1 me-2 text-sm font-medium ml-2 text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 inline-flex items-center"
          >
            {isLoading ? (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-gray-200 animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#1C64F2"
                />
              </svg>
            ) : (
              <CheckIcon className="inline w-4 h-4 me-3 text-gray-400" />
            )}
            {isLoading ? "saving..." : "saved"}
          </button>
        </div>
      </ReactFlow>
      <style>{`
        .react-flow__panel a{
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default FlowChartComponent;
