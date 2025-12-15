import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";

function ConditionalScript({ path, scriptSrc }) {
  const [shouldLoadScript, setShouldLoadScript] = useState(false);
  const router = useRouter();

  const isShow = router.pathname.endsWith("/create-chatbot");

  useEffect(() => {
    if (isShow == true) {
      setShouldLoadScript(true);
    } else {
      setShouldLoadScript(false);
    }
  }, [isShow]);

  return shouldLoadScript ? <Script src={scriptSrc} /> : null;
}

export default ConditionalScript;
