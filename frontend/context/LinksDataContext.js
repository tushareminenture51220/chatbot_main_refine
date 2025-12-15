import dynamic from "next/dynamic";
import React, { createContext, useContext, useEffect, useState } from "react";
const HomeIcon = dynamic(import("@heroicons/react/20/solid/HomeIcon"));
const SwatchIcon = dynamic(import("@heroicons/react/20/solid/SwatchIcon"));
const ShareIcon = dynamic(import("@heroicons/react/20/solid/ShareIcon"));
const UsersIcon = dynamic(import("@heroicons/react/20/solid/UsersIcon"));

const InboxArrowDownIcon = dynamic(
  import("@heroicons/react/20/solid/InboxArrowDownIcon")
);
const Cog8ToothIcon = dynamic(
  import("@heroicons/react/20/solid/Cog8ToothIcon")
);

const UserGroupIcon = dynamic(
  import("@heroicons/react/20/solid/UserGroupIcon")
);
const UserCircleIcon = dynamic(
  import("@heroicons/react/20/solid/UserCircleIcon")
);
const ArrowDownOnSquareStackIcon = dynamic(
  import("@heroicons/react/20/solid/ArrowDownOnSquareStackIcon")
);
const LinksDataContest = createContext();

export function useLinksData() {
  return useContext(LinksDataContest);
}

export function LinksDataProvider({ children }) {
  const LinksData = [
    { name: "Dashboard", icon: HomeIcon, path: "", id: 1 },
    { name: "Inbox", icon: InboxArrowDownIcon, path: "inbox", id: 2 },
    {
      name: "Our Assistants",
      icon: UserGroupIcon,
      path: "our-assistants",
      id: 3,
    },
    {
      name: "Chatbot Users",
      icon: UsersIcon,
      path: "chatbot-users",
      id: 4,
    },
    {
      name: "Create Chatbot Flow",
      icon: ShareIcon,
      path: "create-chatbot-flow",
      id: 5,
    },
    { name: "Themes", icon: SwatchIcon, path: "themes", id: 6 },
    {
      name: "Installation",
      icon: ArrowDownOnSquareStackIcon,
      path: "installation",
      id: 7,
    },
    { name: "Profile", icon: UserCircleIcon, path: "profile", id: 8 },
  ];

  const [open, setOpen] = useState(false);
  const [subLinks, setSubLinks] = useState({
    MainHeading: "Inbox",
    data: [],
    path: "",
  });
  const [active, setActive] = useState("Dashboard");

  useEffect(() => {
    if (subLinks?.data?.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [subLinks]);
  return (
    <LinksDataContest.Provider
      value={{
        active,
        setActive,
        LinksData,
        subLinks,
        setSubLinks,
        open,
        setOpen,
      }}
    >
      {children}
    </LinksDataContest.Provider>
  );
}
