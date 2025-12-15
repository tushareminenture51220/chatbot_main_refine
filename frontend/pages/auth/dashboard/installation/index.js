import Loder from "@/components/Loder";
import { useAuth } from "@/context/AuthContext";
import { customHash } from "@/utiles/cryptoUtils";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ChevronUpIcon = dynamic(
  import("@heroicons/react/24/solid/ChevronUpIcon")
);

const Installation = () => {
  const [code, setCode] = useState(`please try again!`);
  const [show, setShow] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { hashedId } = useAuth();
  const [loading, setLoading] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    });
  };

  useEffect(() => {
    if (hashedId) {
      setCode(`<script
      type="text/javascript"
      src="${process.env.NEXT_PUBLIC_EMBOT_API}/widget/${hashedId}"
    ></script>`);
    }
  }, [hashedId]);

  useEffect(() => {
    if (loading == true) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  return (
    <div className="bg-blue-100 text-blue-600">
      <h2
        id="accordion-color-heading-1"
        onClick={() => {
          setShow(!show);
          setLoading(true);
        }}
      >
        <button className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-blue-200 hover:bg-blue-100">
          <span>Click to generate installation Code</span>
          <ChevronUpIcon className="w-5 h-5 rotate-180 shrink-0 font-bold" />
        </button>
      </h2>
      {show == true &&
        (loading == true ? (
          <Loder />
        ) : (
          <div aria-labelledby="accordion-color-heading-1">
            <div className=" p-5 border border-b-0 border-gray-200">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-2 flex items-center justify-between">
                  <span className="text-gray-500">Installation Code</span>
                  <button
                    onClick={copyToClipboard}
                    className={`bg-blue-500 text-white font-bold px-2 py-1 rounded ${
                      isCopied ? "bg-green-500" : "hover:bg-blue-600"
                    }`}
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-4 language-bash bg-white">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Installation;
