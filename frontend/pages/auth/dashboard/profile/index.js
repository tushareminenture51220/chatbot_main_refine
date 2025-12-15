import ProfileRegistrationForm from "@/components/ProfilePageForm";
import { useLinksData } from "@/context/LinksDataContext";
import React, { useEffect } from "react";

const Profile = () => {
  const { setSubLinks } = useLinksData();
  useEffect(() => {
    setSubLinks({
      MainHeading: "Profile",
      data: [],
    });
  }, []);
  return (
    <>
      <ProfileRegistrationForm />
    </>
  );
};

export default Profile;
