import React, { useEffect, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import dynamic from "next/dynamic";
const FaceSmileIcon = dynamic(() =>
  import("@heroicons/react/24/solid/FaceSmileIcon")
);
const TrashIcon = dynamic(() => import("@heroicons/react/24/solid/TrashIcon"));
const WFTextAreaTagWithEmojies = ({
  formData,
  index,
  handleChange,
  removeTag,
  tag,
  setFormData,
}) => {
  const [showEmojis, setShowEmojis] = useState(false);

  const addEomoji = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [index]: {
        ...prevData[index],
        responseText: `${prevData[index]?.responseText + e.native}`,
      },
    }));
  };

  return (
    <div className="group mb-2 relative">
      <textarea
        value={formData[index]?.responseText}
        name="responseText"
        onChange={(e) => handleChange(e, index)}
        rows="3"
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-blue-300 focus:ring-blue-500 focus:border-blue-500 focus-visible:border-blue-500 resize-none"
        placeholder="Type a message that will be sent to a visitor..."
      ></textarea>
      <button
        type="button"
        className="group-hover:block hidden absolute top-1/2 -right-5 -translate-y-1/2"
        onClick={() => removeTag(tag.id, index)}
      >
        <TrashIcon className="text-red-500 w-5 h-4/5" />
      </button>
      <div className="w-full overflow-x-hidden">
        {showEmojis && (
          <div
            id="EmojiPicker"
            className={`absolute top-[20] left-0 z-50 shadow-md rounded-lg -right-[7.5rem] h-80 overflow-hidden animate-fade-up`}
          >
            <Picker
              data={data}
              emojiSize={20}
              onEmojiSelect={addEomoji}
              maxFrequentRows={0}
              perLine={8}
              previewPosition={"none"}
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
        >
          <FaceSmileIcon
            className={`w-6 h-6 hover:bg-gray-50 hover:rounded-full ${
              showEmojis ? "color-green-500" : "color-gray-50"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default WFTextAreaTagWithEmojies;
