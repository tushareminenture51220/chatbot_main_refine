import dynamic from "next/dynamic";
import React, { createContext, useContext, useEffect, useState } from "react";
const HomeIcon = dynamic(import("@heroicons/react/20/solid/HomeIcon"));
const UsersIcon = dynamic(import("@heroicons/react/20/solid/UsersIcon"));

const InboxArrowDownIcon = dynamic(
  import("@heroicons/react/20/solid/InboxArrowDownIcon")
);

const UserGroupIcon = dynamic(
  import("@heroicons/react/20/solid/UserGroupIcon")
);
const UserCircleIcon = dynamic(
  import("@heroicons/react/20/solid/UserCircleIcon")
);

const MasterAdminLinksDataContest = createContext();

export function useMasterAdminLinksData() {
  return useContext(MasterAdminLinksDataContest);
}

export function MasterAdminLinksDataProvider({ children }) {
  const LinksData = [
    { name: "Dashboard", icon: HomeIcon, path: "", id: 1 },
    {
      name: "Accounts",
      icon: UserCircleIcon,
      path: "master-admin-accounts",
      id: 2,
    },
    {
      name: "Inbox",
      icon: InboxArrowDownIcon,
      path: "master-admin-inbox",
      id: 2,
    },
    {
      name: "Our Assistants",
      icon: UserGroupIcon,
      path: "master-admin-assistance",
      id: 3,
    },
    {
      name: "Chatbot Users",
      icon: UsersIcon,
      path: "master-admin-users",
      id: 4,
    },
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
    <MasterAdminLinksDataContest.Provider
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
    </MasterAdminLinksDataContest.Provider>
  );
}
