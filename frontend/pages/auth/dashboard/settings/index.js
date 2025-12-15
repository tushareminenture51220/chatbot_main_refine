import { useLinksData } from "@/context/LinksDataContext";
import React, { useEffect } from "react";

const Settings = () => {
  const { setSubLinks } = useLinksData();
  useEffect(() => {
    setSubLinks({
      MainHeading: "Settings",
      data: [],
    });
  }, []);
  return <div>Settings : under developement</div>;
};

export default Settings;
