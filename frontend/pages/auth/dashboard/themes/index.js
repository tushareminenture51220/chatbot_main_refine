import ThemeSelector from "@/components/themes/ThemeSelector";
import { useAuth } from "@/context/AuthContext";
import { useLinksData } from "@/context/LinksDataContext";
import React, { useEffect } from "react";

const Themes = () => {
  const { setSubLinks } = useLinksData();
  const { userId, user } = useAuth();

  useEffect(() => {
    setSubLinks({
      MainHeading: "Themes",
      data: [],
    });
  }, []);

  return (
    <div>
      <ThemeSelector adminId={userId} adminSelectedTheme={user.theme} />
    </div>
  );
};

export default Themes;
