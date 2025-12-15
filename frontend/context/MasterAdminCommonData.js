import React, { createContext, useContext, useEffect, useState } from "react";
import { useMasterAdminAuth } from "./MasterAdminAuthContext";
import axios from "axios";

const MasterAdminCommonDataContext = createContext();

// Custom hook to access the Common Data of Master Admin
export function useMasterAdminCommonData() {
  return useContext(MasterAdminCommonDataContext);
}

// AuthProvider component
export function MasterAdminCommonDataProvider({ children }) {
  const { userIdMA } = useMasterAdminAuth();
  const [linkedAccountsData, setLinkedAccountsData] = useState([]);
  const [allAcountsUsersData, setAllAcountsUsersData] = useState([]);
  const [assistantsMA, setAssistantsMA] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mergedDataMA, setMergedDataMA] = useState([]);
  const [prasentAccounts, setPrasentAccounts] = useState({});
  const [activeCWUsers, setActiveCWUsers] = useState([]);

  const getData = () => {
    axios({
      url: `${process.env.NEXT_PUBLIC_EMBOT_API}/master/get-accounts/${userIdMA}`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res);
        setLinkedAccountsData(res?.data?.data);
      })
      .catch((error) => console.log("getData-error", error));
  };

  const getAllAccountsUsersData = (data) => {
    axios({
      url: `${process.env.NEXT_PUBLIC_EMBOT_API}/master/get-particular-accounts-user`,
      method: "POST",
      data: data,
    })
      .then((res) => {
        // console.log("res", res);
        setAllAcountsUsersData(res?.data?.data);
      })
      .catch((error) => console.log("getAllAccountsUsersData-error", error));
  };

  const getMasterAdminAssistants = (userIdMA) => {
    setIsLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_EMBOT_API}/master/get-assistants/${userIdMA}`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        // console.log("getMasterAdminAssistants", res);
        setAssistantsMA(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log("getMasterAdminAssistants-error", e);
        setIsLoading(false);
      });
  };
  const mergeDataFunc = () => {
    // Step 1: Create a map where each adminId points to an array of users
    const userMap = allAcountsUsersData.reduce((acc, user) => {
      const { adminId } = user; // Extract adminId from the user object
      if (!acc[adminId]) {
        acc[adminId] = []; // Initialize array if it doesn't exist
      }
      acc[adminId].push(user); // Add user to the corresponding adminId array
      return acc;
    }, {});

    // Step 2: Map over linkedAccountsData and merge users
    const merged = linkedAccountsData.map((account) => {
      // Use the accountId to find users in userMap
      const users = userMap[account.accountId] || []; // Default to empty array if no users found
      return {
        ...account, // Spread the account data
        users, // Add the users found for this account
      };
    });
    console.log("merged", merged);
    setMergedDataMA(merged);
  };

  useEffect(() => {
    // Dynamically create the linkedAccountsId object and call get users data function
    if (linkedAccountsData?.length > 0) {
      const accountsIdObj = {};
      linkedAccountsData?.forEach((item, index) => {
        accountsIdObj[index] = item.accountId;
      });
      setPrasentAccounts(accountsIdObj);
      getAllAccountsUsersData(accountsIdObj);
    }
  }, [linkedAccountsData]);

  useEffect(() => {
    if (userIdMA) {
      getData();
    }
  }, [userIdMA]);

  // useEffect(() => {
  //   console.log(mergedDataMA);
  // }, [mergedDataMA]);

  useEffect(() => {
    if (allAcountsUsersData?.length > 0 && linkedAccountsData?.length > 0) {
      mergeDataFunc();
    }
  }, [allAcountsUsersData, linkedAccountsData]);
  return (
    <MasterAdminCommonDataContext.Provider
      value={{
        getData,
        linkedAccountsData,
        getAllAccountsUsersData,
        allAcountsUsersData,
        getMasterAdminAssistants,
        assistantsMA,
        mergedDataMA,
        prasentAccounts,
        activeCWUsers,
        setActiveCWUsers,
      }}
    >
      {children}
    </MasterAdminCommonDataContext.Provider>
  );
}
