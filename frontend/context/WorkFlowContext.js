import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

// WorkFlowContext context
const WorkFlowContext = createContext();

//custom hook to access the WorkFlowContext state
export function useWorkFlowContextData() {
  return useContext(WorkFlowContext);
}

// ChatDataProvider component
export function WorkFlowContextProvider({ children }) {
  const [isOpenBottomSubMenusTR, setIsOpenBottomSubMenusTR] = useState(false);
  const [isActiveBottomTRForm, setIsActiveBottomTRForm] = useState({
    status: false,
    id: "",
    activeNode: {},
  });
  const [nextActionDelayTime, setNextActionDelayTime] = useState(false);

  const [databaseNodes, setDataBaseNodes] = useState([]);
  const [databaseEdges, setDataBaseEdges] = useState([]);
  const [updatedNodes, setUpdatedNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { authJWTToken, userId } = useAuth();
  const [outOfFlowData, setOutOfFlowData] = useState({});

  //updateTRData to the database
  const updateTRNodesAndEdges = async (payload) => {
    //console.log(payload, "payload");
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/auth/updateNodeAndEdges/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authJWTToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        //console.log("Data updated successfully:", responseData);
        setDataBaseNodes(responseData?.TRNodesAndEdge?.tRNodes);
        setDataBaseEdges(responseData?.TRNodesAndEdge?.tREdges);
        setIsLoading(false);
        setOutOfFlowData(responseData?.updatedTRNodeEdge?.outOfFlowData);

        return responseData;
      } else {
        console.error("Failed to update data");
        setIsLoading(false);
        //throw new Error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      setIsLoading(false);
      //throw error;
    }
  };

  const deleteTREdgeORNode = async (deleteFor, id) => {
    try {
      const API = `${process.env.NEXT_PUBLIC_EMBOT_API}/auth/deleteTR/${userId}/${deleteFor}/${id}`;
      const response = await fetch(API, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authJWTToken}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
       // console.log("Node OR Edge deleted successfully:", responseData);
        return responseData;
      } else {
        console.error("Failed to delete node or id not found");
        //  throw new Error("Failed to delete node");
      }
    } catch (error) {
      console.error("Error deleting node:", error);
      //  throw error;
    }
  };

  const getData = async (id) => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/auth/getNodeAndEdges/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authJWTToken}`,
          },
        }
      );
      let data = await res.json();
      if (data) {
        setDataBaseNodes(data?.TRNodesAndEdge?.tRNodes);
        setDataBaseEdges(data?.TRNodesAndEdge?.tREdges);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getData(userId);
  }, []);

  return (
    <WorkFlowContext.Provider
      value={{
        isActiveBottomTRForm,
        setIsActiveBottomTRForm,
        isOpenBottomSubMenusTR,
        setIsOpenBottomSubMenusTR,
        updateTRNodesAndEdges,
        deleteTREdgeORNode,
        isLoading,
        databaseEdges,
        databaseNodes,
        nextActionDelayTime,
        setNextActionDelayTime,
        outOfFlowData,
        setOutOfFlowData,
      }}
    >
      {children}
    </WorkFlowContext.Provider>
  );
}
