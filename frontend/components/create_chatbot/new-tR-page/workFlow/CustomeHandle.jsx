import React, { useMemo } from "react";
import { getConnectedEdges, Handle, useNodeId, useStore } from "reactflow";

const selector = (s) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

const CustomeHandle = (props) => {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId();

  const isHandleConnectable = useMemo(() => {
    const node = nodeInternals.get(nodeId);
    const connectedEdges = getConnectedEdges([node], edges);

    // Helper function to get unique target nodes connected to this node's handles
    const getUniqueTargetNodes = (edges) => {
      const targetNodes = new Set();
      edges.forEach((edge) => {
        if (edge.source === nodeId) {
          targetNodes.add(edge.target);
        }
      });
      return targetNodes;
    };

    const uniqueTargetNodes = getUniqueTargetNodes(connectedEdges);

    if (typeof props.isConnectable === "function") {
      return props.isConnectable({ node, connectedEdges, uniqueTargetNodes });
    }

    if (typeof props.isConnectable === "number") {
      return uniqueTargetNodes.size < props.isConnectable;
    }

    return props.isConnectable;
  }, [nodeInternals, edges, nodeId, props.isConnectable]);

  return (
    <Handle
      style={{
        width: "12px",
        height: "12px",
        background:
          props.decisiontrigger == "true" && props.position == "right"
            ? "green"
            : props.decisiontrigger == "true" && props.position == "left"
            ? "red"
            : "#394f31",
        border: "1px solid #fff",
      }}
      {...props}
      isConnectable={isHandleConnectable}
    />
  );
};

export default CustomeHandle;

// import React, { useMemo } from "react";
// import { getConnectedEdges, Handle, useNodeId, useStore } from "reactflow";

// const selector = (s) => ({
//   nodeInternals: s.nodeInternals,
//   edges: s.edges,
// });

// const CustomHandle = (props) => {
//   const { nodeInternals, edges } = useStore(selector);
//   const nodeId = useNodeId();

//   const isHandleConnectable = useMemo(() => {
//     if (typeof props.isConnectable === "function") {
//       const node = nodeInternals.get(nodeId);
//       const connectedEdges = getConnectedEdges([node], edges);
//       return props.isConnectable({ node, connectedEdges });
//     }

//     if (typeof props.isConnectable === "number") {
//       const node = nodeInternals.get(nodeId);
//       const connectedEdges = getConnectedEdges([node], edges);

//       return connectedEdges.length < props.isConnectable;
//     }

//     return props.isConnectable;
//   }, [nodeInternals, edges, nodeId, props.isConnectable]);

//   return <Handle
//   style={{
//             width: "12px",
//             height: "12px",
//             background:
//               props.decisiontrigger == "true" && props.position == "right"
//                 ? "green"
//                 : props.decisiontrigger == "true" && props.position == "left"
//                 ? "red"
//                 : "#394f31",
//             border: "1px solid #fff",
//           }}
//   {...props} isConnectable={isHandleConnectable}></Handle>;
// };

// export default CustomHandle;
