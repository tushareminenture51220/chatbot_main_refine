import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
const PaperClipIcon = dynamic(
  import("@heroicons/react/24/outline/PaperClipIcon")
);
const PhotoIcon = dynamic(import("@heroicons/react/24/outline/PhotoIcon"));
const FolderOpenIcon = dynamic(
  import("@heroicons/react/24/outline/FolderOpenIcon")
);

const DocumentArrowUpIcon = dynamic(
  import("@heroicons/react/24/solid/DocumentArrowUpIcon")
);
const FileUploaderLiveChat = ({
  selectedFile,
  setTextMessage,
  setSelectedFile,
  handleSubmit,
}) => {
  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile);
      }
    };
  }, [selectedFile]);
  // console.log("selectedFile", selectedFile);
  return (
    <div
      className="relative z-99 w-full"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background backdrop */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-full overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* Modal panel */}
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              {selectedFile?.type?.startsWith("image/") ? (
                <p className="text-sm text-gray-600 flex items-center">
                  <PhotoIcon className="fill-current text-gray-400 w-5 h-5 mr-2" />
                  Send as image
                </p>
              ) : (
                <p className="text-sm text-gray-600 flex items-center">
                  <FolderOpenIcon className="fill-current text-gray-400 w-5 h-5 mr-2" />
                  Send as file
                </p>
              )}
              <br />
              <div className="flex items-center justify-start gap-2">
                {!selectedFile?.type?.startsWith("image/") && (
                  <div className="bg-cyan-500 rounded-full w-12 h-12 grid place-items-center">
                    <DocumentArrowUpIcon className="w-7 h-7 text-white" />
                  </div>
                )}
                <div>
                  {selectedFile?.type?.startsWith("image/") ? (
                    <div className="flex items-center gap-2">
                      <img
                        className="rounded-full"
                        src={URL.createObjectURL(selectedFile)}
                        width={100}
                        height={100}
                      />
                      <h5 className="font-semibold text-gray-600">
                        {selectedFile?.name?.length > 18
                          ? `${selectedFile?.name?.slice(
                              0,
                              18 - 3
                            )}...${selectedFile?.name?.slice(-10)}`
                          : selectedFile?.name}
                      </h5>
                    </div>
                  ) : (
                    <h5 className="font-semibold text-gray-600">
                      {selectedFile?.name?.length > 18
                        ? `${selectedFile?.name?.slice(
                            0,
                            18 - 3
                          )}...${selectedFile?.name?.slice(-10)}`
                        : selectedFile?.name}
                    </h5>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <form className="w-full max-w-md" onSubmit={handleSubmit}>
                <div className="flex items-center border-b border-teal-500 py-2">
                  <input
                    onChange={(e) => setTextMessage(e.target.value)}
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="text"
                    placeholder="Caption"
                    aria-label="Full name"
                  />
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="flex-shrink-0 border-transparent border-4 text-cyan-500 hover:text-cyan-800 text-sm py-1 px-2 rounded"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-shrink-0 bg-cyan-500 hover:bg-cyan-700 border-cyan-500 hover:border-cyan-700 text-sm border-4 text-white py-1 px-2 rounded"
                    type="submit"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploaderLiveChat;
