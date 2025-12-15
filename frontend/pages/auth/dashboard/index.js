import BarChart from "@/components/dashborad/components/BarChart";
import LineChart from "@/components/dashborad/components/LineChart";
import MapStatLib from "@/components/dashborad/components/MapStatLib";
import PieChart from "@/components/dashborad/components/PieChart";
import UsersStat from "@/components/dashborad/components/UsersStat";
import TrafficMap from "@/components/Master-admin/TrafficMap";
import { useAuth } from "@/context/AuthContext";
import { ChatBotDataProvider } from "@/context/ChatBotContest";
import { useLinksData } from "@/context/LinksDataContext";
import { useLiveChatData } from "@/context/livechatContext";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/solid/ChatBubbleLeftRightIcon";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import dynamic from "next/dynamic";

const PresentationChartBarIcon = dynamic(
  import("@heroicons/react/24/outline/PresentationChartBarIcon")
);
const QuestionMarkCircleIcon = dynamic(
  import("@heroicons/react/24/solid/QuestionMarkCircleIcon")
);
const CheckBadgeIcon = dynamic(
  import("@heroicons/react/24/solid/CheckBadgeIcon")
);
import Link from "next/link";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { isAuthenticated, authJWTToken, userId } = useAuth();
  const { setSubLinks } = useLinksData();
  const [perfData, setPerfData] = useState({});
  const {
    users,
    isLoading,
    getLiveChatUsers,
    assistants,
    getLiveChatAssistants,
  } = useLiveChatData();
  const statsData = [
    {
      label: "Total Unique Users",
      labelShort: "TUU",
      value: perfData?.Total_Unique_Users || 0,
      icon: UserGroupIcon,
      color: "#E6E6FA",
    },
    {
      label: "Total Chatbot Sessions",
      value: perfData?.Total_Chatbot_Sessions || 0,
      icon: ChatBubbleLeftRightIcon,
      color: "#2facff",
      labelShort: "TCS",
    },
    {
      label: "Total Users Queries",
      value: perfData?.Total_Users_Queries || 0,
      color: "#ffcf04",
      icon: QuestionMarkCircleIcon,
      labelShort: "TUQ",
      subheading: "queries from chatbot sessions",
    },
    {
      label: "Form Filling Ratio",
      value: perfData?.First_Contact_Resolution || 0,
      icon: CheckBadgeIcon,
      color: "#ff8900",
      labelShort: "FCR",
    },
  ];

  useEffect(() => {
    setSubLinks({
      MainHeading: "Inbox",
      data: [],
    });
  }, []);

  const getPerformanceData = async () => {
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_EMBOT_API}/get-performance-data`
      );
      let data = await res.json();
      if (data.status == "success") {
        setPerfData(data.performanceData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPerformanceData();
  }, []);
  useEffect(() => {
    if (authJWTToken && userId) {
      getLiveChatUsers(authJWTToken, userId);
      getLiveChatAssistants(authJWTToken, userId);
    }
  }, [authJWTToken, userId]);
  if (!isAuthenticated) {
    // If token is not present, redirect or show a message
    return (
      <div className="m-24">
        <h1 className="font-semibold text-lg">
          You are not authorized to access this page.
          <Link href="/login" className="text-blue-500">
            {" Login"}
          </Link>
        </h1>
      </div>
    );
  }

  // If token is present, render the dashboard content
  return (
    <>
      <ChatBotDataProvider>
        <div className="overflow-auto h-[85vh] w-full">
          <div className="flex justify-start items-center gap-4">
            <div className="bg-[#EBFAFD] rounded-full p-2">
              <PresentationChartBarIcon className="w-7 h-7 text-gray-700" />
            </div>
            <div>
              <h3 className="text-md font-semibold">EM Bot </h3>
              <p className="text-gray-500 text-sm">
                Overall Performance Overview
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {statsData?.map((elem, index) => (
              <div
                key={index}
                style={{ boxShadow: "0px 0px 13px #B6BEFC" }}
                className="bg-[#EBFAFD] w-72 h-40 overflow-hidden rounded-md p-4 flex flex-col justify-between gap-2 shadow-md"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{elem?.value}</h3>
                  <span className="bg-white rounded-full p-2">
                    <elem.icon className="w-7 h-7 text-blue-500" />
                  </span>
                </div>
                <p className="m-0 text-sm">
                  {elem?.subheading ? `(${elem?.subheading})` : ""}
                </p>
                <span className="text-sm">{elem?.label}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="overflow-y-auto flex flex-col flex-grow justify-around items-start">
              <UsersStat
                users={users}
                isLoading={isLoading}
                label={"Users"}
                assistantsSide={false}
              />
            </div>
            <div className="overflow-y-auto flex flex-col flex-grow justify-around items-start">
              <UsersStat
                users={assistants}
                isLoading={isLoading}
                label={"Assistants"}
                assistantsSide={true}
              />
            </div>
            <div className="overflow-y-auto flex flex-col flex-grow justify-around items-start">
              <PieChart
                botCount={perfData?.First_Contact_Resolution}
                liveCount={perfData?.Queries_Resolution_LiveChat}
              />
            </div>
          </div>
          <div className="flex">
            <div className="grid place-items-center w-[95%] mx-auto p-4">
              <BarChart
                statsData={statsData}
                livechatValue={perfData?.Queries_Resolution_LiveChat}
              />
            </div>
            <div className="grid place-items-center w-[95%] mx-auto p-4">
              <TrafficMap usersData={users} />
            </div>
          </div>
        </div>
      </ChatBotDataProvider>
      <style>{`
        #hidden {
          display: none;
        }
        `}</style>
    </>
  );
};

export default Dashboard;
