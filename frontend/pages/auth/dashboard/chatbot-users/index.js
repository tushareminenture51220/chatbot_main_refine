import LiveUsersList from "@/components/live-users/LiveUsersList";
import { useLinksData } from "@/context/LinksDataContext";
import React, { useEffect } from "react";

const LiveUsers = () => {
  return (
    <>
      <LiveUsersList />
    </>
  );
};

export default LiveUsers;
