import { useAuth } from "@/context/AuthContext";
import Script from "next/script";
import React from "react";

const ScriptTagBot = () => {
  const { hashedId } = useAuth();
  return (
    <>
      {hashedId && (
        <Script
          strategy="lazyOnload"
          src={`${process.env.NEXT_PUBLIC_EMBOT_API}/widget/${hashedId}`}
        />
      )}
    </>
  );
};

export default ScriptTagBot;
