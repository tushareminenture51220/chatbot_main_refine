import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
const ChevronRightIcon = dynamic(
  import("@heroicons/react/20/solid/ChevronRightIcon")
);
const PlayIcon = dynamic(import("@heroicons/react/20/solid/PlayIcon"));

const Accordium = ({ MainHeading, data, path }) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  return (
    <div className="w-full px-3 cursor-pointer">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-[100%] text-gray-200 font-semibold"
      >
        <span className="w-full rounded-sm">{MainHeading}</span>
        <ChevronRightIcon
          className={`w-5 h-5 font-semibold transform ${
            isOpen ? "rotate-90" : "rotate-0"
          } transition-transform`}
        />
      </div>

      <ul className="ml-1 text-white text-sm mt-3 grid justify-start items-start gap-3 w-full ">
        {data?.map((elem, index) => (
          <li key={index} className="flex items-center justify-start">
            <PlayIcon className="w-7 h-4" />
            <Link
              href={`${path}/${elem.path}`}
              className={`${
                false && "bg-[#123e52] border-l-2 border-blue-400"
              } py-1 rounded-sm pr-1 pl-2 cursor-pointer hover:bg-[#123e52] w-full`}
            >
              {elem.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Accordium;
