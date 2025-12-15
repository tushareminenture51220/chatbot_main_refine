import { useWorkFlowContextData } from "@/context/WorkFlowContext";
import dynamic from "next/dynamic";
import React from "react";
import {
  BezierEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from "reactflow";

const XMarkIcon = dynamic(() => import("@heroicons/react/24/solid/XMarkIcon"));

const CustomeEdge = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
  } = props;

  const { setEdges } = useReactFlow();
  const { deleteTREdgeORNode } = useWorkFlowContextData();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const arrowPath = `M ${targetX - 10} ${targetY} L ${
    targetX + 10
  } ${targetY} L ${targetX} ${targetY + 10} Z`;

  // Calculate label position
  const labelOffsetX =
    sourcePosition === "left" ? -10 : sourcePosition === "right" ? 10 : 0;
  const labelOffsetY =
    sourcePosition === "top" || sourcePosition === "bottom" ? 10 : 0;

  return (
    <>
      <path
        style={{
          stroke: "#7e7e92",
          strokeWidth: 4,
          fill: "transparent",
        }}
        d={edgePath}
      />
      <EdgeLabelRenderer>
        <div className="flex items-center">
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-sm text-black"
            style={{
              left: `${labelX + labelOffsetX}px`,
              top: `${labelY + labelOffsetY - 20}px`, // Adjust to position above the delete icon
            }}
          >
            {label}
          </div>
          <XMarkIcon
            onClick={() => {
              setEdges((prevEdges) =>
                prevEdges.filter((edge) => edge.id !== id)
              );
              // deleteTREdgeORNode("edge", id);
            }}
            className={`w-5 h-5 pointer-events-auto cursor-pointer text-red-500 bg-white rounded-full absolute transform -translate-x-1/2 -translate-y-1/2`}
            style={{ left: `${labelX}px`, top: `${labelY}px` }}
            aria-label="Delete-Edge"
          />
        </div>
      </EdgeLabelRenderer>
      <path d={arrowPath} fill="#7e7e92" />
    </>
  );
};

export default CustomeEdge;
