import { useChatData } from "@/context/ChatBotContest";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PreviewCard from "./PreviewCard";
import EditTriggerAndResponse from "./EditTriggerAndResponse";

const Preview = ({
  initialResponses,
  authJWTToken,
  setIsLoading,
  getChatBotData,
}) => {
  const chatBotContainerRef = useRef(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedData, setShowEditedData] = useState();
  const [tRData, setTRData] = useState({});
  const [sortedResponses, setSortedResponses] = useState([]);
  //console.log("initialResponses", initialResponses);

  const getParticularData = async (id) => {
    setIsLoading(true);
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/chatbot/get-particular-data/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authJWTToken}`,
          },
        }
      );
      let data = await res.json();
      setTRData(data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const handleEditResponse = (id) => {
    getParticularData(id);
    setShowEditForm(true);
  };
  const handleDeleteResponse = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/chatbot/delete-data/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authJWTToken}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        // console.log(data);
        toast.success(data.message, { theme: "dark" });
        setIsLoading(false);
        getChatBotData(authJWTToken);
      } else {
        toast.error(data.message, { theme: "dark" });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const sortOrder = { 1: "0", 2: "1", 3: "2", false: 3 };
    const sortedValues = initialResponses.sort((a, b) => {
      const aIndex = sortOrder[a.initialResponse];
      const bIndex = sortOrder[b.initialResponse];
      return aIndex - bIndex;
    });
    setSortedResponses(sortedValues);
    chatBotContainerRef.current.scrollTop =
      chatBotContainerRef.current.scrollHeight;
  }, [initialResponses]);

  return (
    <>
      <div
        className="overflow-y-auto h-[80vh] rounded-md p-4"
        ref={chatBotContainerRef}
        style={{ scrollBehavior: "smooth" }}
      >
        <ol className="relative border-s border-gray-400">
          {sortedResponses?.map((response, index) => (
            <li className="mb-10 ms-6" key={index}>
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
                {index + 1}
              </span>
              <div className="items-center justify-between p-2 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex">
                <PreviewCard
                  response={response}
                  index={index}
                  handleDeleteResponse={handleDeleteResponse}
                  handleEditResponse={handleEditResponse}
                  setIsLoading={setIsLoading}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>

      {showEditForm && (
        <EditTriggerAndResponse
          setShowEditForm={setShowEditForm}
          tRData={tRData}
          setIsLoading={setIsLoading}
          authJWTToken={authJWTToken}
        />
      )}
    </>
  );
};

export default Preview;
