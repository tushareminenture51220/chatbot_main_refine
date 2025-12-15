import dynamic from "next/dynamic";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Dynamically import icons
const EnvelopeIcon = dynamic(() =>
  import("@heroicons/react/24/outline/EnvelopeIcon")
);
const UserIcon = dynamic(() => import("@heroicons/react/24/outline/UserIcon"));

const PlusCircleIcon = dynamic(() =>
  import("@heroicons/react/24/solid/PlusCircleIcon")
);
const Bars2Icon = dynamic(() => import("@heroicons/react/24/solid/Bars2Icon"));
const LinkIcon = dynamic(() => import("@heroicons/react/24/outline/LinkIcon"));
const BarsArrowUpIcon = dynamic(() =>
  import("@heroicons/react/24/outline/BarsArrowUpIcon")
);
const DocumentTextIcon = dynamic(() =>
  import("@heroicons/react/24/outline/DocumentTextIcon")
);

const inputTypes = [
  { id: 1, inputIcon: UserIcon, inputType: "Name" },
  { id: 2, inputIcon: EnvelopeIcon, inputType: "Email" },
  { id: 3, inputIcon: Bars2Icon, inputType: "Number" },
  { id: 4, inputIcon: BarsArrowUpIcon, inputType: "Text" },
  { id: 5, inputIcon: DocumentTextIcon, inputType: "Long Text" },
  { id: 6, inputIcon: LinkIcon, inputType: "URL" },
];

const CustomemDropDownComponent = ({ inputTags, setInputTags }) => {
  const [showFieldsOptions, setShowFieldsOptions] = useState(false);

  const setInputTagFunc = (elem) => {
    // console.log("inputTags", inputTags);
    setInputTags((prevTags) => [
      ...prevTags,
      {
        id: uuidv4(),
        inputType: elem.inputType,
        inputTagType:
          elem.inputType === "Number"
            ? "number"
            : elem.inputType === "Email"
            ? "email"
            : elem.inputType === "URL"
            ? "url"
            : elem.inputType === "File"
            ? "file"
            : "text",
        required: true,
        placeholder: `Enter ${elem.inputType}...`,
        inputIcon: elem.inputIcon,
      },
    ]);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowFieldsOptions(!showFieldsOptions)}
        disabled={inputTags?.length === 5}
        className="py-2.5 mt-2 w-full text-center grid place-items-center px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
      >
        <PlusCircleIcon className="w-7 h-7 text-blue-500" />
      </button>

      {showFieldsOptions && (
        <div className="grid place-items-center w-full">
          <div className="w-2/3 text-sm bg-white border border-gray-100 rounded-lg shadow-md">
            <div className="py-2 px-1 w-full text-gray-900 md:pb-4">
              <ul className="space-y-1 w-full">
                {inputTypes?.map((elem) => (
                  <li
                    key={elem.id}
                    onClick={() => {
                      setInputTagFunc(elem);
                      setShowFieldsOptions(false);
                    }}
                    className="flex px-1 py-2 gap-1 hover:bg-gray-100 w-full cursor-pointer"
                  >
                    <elem.inputIcon className="w-5 h-5 mr-2" />
                    <button
                      type="button"
                      className="text-gray-500 hover:text-blue-600"
                    >
                      {elem.inputType}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomemDropDownComponent;
