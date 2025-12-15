import MAChatWindow from "@/components/Master-admin/Inbox/MAChatWindow";
import MasterAdminInboxUsers from "@/components/Master-admin/Inbox/MasterAdminInboxUsers";
import UserInfoPopup from "@/components/Master-admin/Inbox/UserInfoPopup";
import NoUsersFound from "@/components/NoUsersFound";
import { useMasterAdminCommonData } from "@/context/MasterAdminCommonData";
import React, { act, useEffect, useState } from "react";

const MasterAdminInbox = () => {
  const { mergedDataMA } = useMasterAdminCommonData();
  const { chatWindowLimit, setChatWindowLimit } = useState(2);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [activeUserInfoPopup, setActiveUserInfoPopup] = useState(false);
  const { activeCWUsers, setActiveCWUsers } = useMasterAdminCommonData();

  const handleUserClick = (user) => {
    // Check if the user already exists in activeCWUsers
    if (activeCWUsers.some((activeUser) => activeUser._id === user._id)) {
      return; // User already exists, do nothing
    }

    // If adding a new user exceeds the limit, remove the first user
    if (activeCWUsers.length >= 2) {
      // Remove the first user and add the new one
      setActiveCWUsers((prev) => [...prev.slice(1), user]);
    } else {
      // Just add the new user
      setActiveCWUsers((prev) => [...prev, user]);
    }
  };
  const closeChatWindow = (id) => {
    setActiveCWUsers((prev) => prev.filter((chat) => chat._id !== id));
  };
  useEffect(() => {
    if (mergedDataMA?.[0]?.users?.[0]?.deletedStatus === true) {
      const userToAdd = {
        ...mergedDataMA[0].users[0],
        companyWebsite: mergedDataMA[0]?.companyWebsite,
        adminEmail: mergedDataMA[0]?.accountEmail,
      };

      setActiveCWUsers((prev) => {
        // Check if the user already exists
        if (prev.some((activeUser) => activeUser._id === userToAdd._id)) {
          return prev; // User already exists, return current state
        }

        // Add the new user while maintaining the limit of 2
        return prev.length >= 2
          ? [...prev.slice(1), userToAdd]
          : [...prev, userToAdd];
      });
    }
  }, [mergedDataMA]);

  return (
    <>
      <div className="flex h-full relative w-full">
        {/* users */}
        <div className="w-fit h-full relative">
          <MasterAdminInboxUsers
            onUserClick={handleUserClick}
            mergedDataMA={mergedDataMA}
            setActiveCWUsers={setActiveCWUsers}
          />
          ;
        </div>
        {/* inbox */}
        <div className="w-full h-full flex">
          {activeCWUsers?.length >= 1 ? (
            activeCWUsers?.map((user, index) => (
              <div key={index} className="w-full">
                <MAChatWindow
                  setActiveUserInfoPopup={setActiveUserInfoPopup}
                  user={user}
                  onClose={() => closeChatWindow(user._id)}
                />
              </div>
            ))
          ) : (
            <div className="w-full m-auto">
              <NoUsersFound title={"No Chat Window opens!"} description={""} />
            </div>
          )}
        </div>
      </div>
      {activeUserInfoPopup && (
        <UserInfoPopup
          setActiveUserInfoPopup={setActiveUserInfoPopup}
          activeUserInfoPopup={activeUserInfoPopup}
        />
      )}
    </>
  );
};

export default MasterAdminInbox;
