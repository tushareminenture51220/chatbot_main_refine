import Loder from "@/components/Loder";
import AccountsPage from "@/components/Master-admin/AccountsPage";
import LinkedAccountsForm from "@/components/Master-admin/LinkedAccountsForm";
import OTPVerficationForm from "@/components/Master-admin/OTPVerficationForm";
import { useMasterAdminAuth } from "@/context/MasterAdminAuthContext";
import { useMasterAdminCommonData } from "@/context/MasterAdminCommonData";
import axios from "axios";
import React, { useEffect, useState } from "react";

const MasterAdminAccounts = () => {
  const [showForm, setShowForm] = useState(false);
  const [showOTPFrom, setShowOTPForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailInProcess, setEmailInProcess] = useState("");
  const { userIdMA } = useMasterAdminAuth();
  const { getData, linkedAccountsData } = useMasterAdminCommonData();

  return (
    <div>
      <AccountsPage
        showForm={showForm}
        setShowForm={setShowForm}
        getData={getData}
        linkedAccountsData={linkedAccountsData}
      />
      {showForm &&
        (!showOTPFrom ? (
          <LinkedAccountsForm
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setShowOTPForm={setShowOTPForm}
            showForm={showForm}
            setShowForm={setShowForm}
            setEmailInProcess={setEmailInProcess}
            getData={getData}
          />
        ) : (
          <OTPVerficationForm
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setShowForm={setShowForm}
            setShowOTPForm={setShowOTPForm}
            emailInProcess={emailInProcess}
            setEmailInProcess={setEmailInProcess}
            getData={getData}
          />
        ))}

      {isLoading && <Loder />}
    </div>
  );
};

export default MasterAdminAccounts;
