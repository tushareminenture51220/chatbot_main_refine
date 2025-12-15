import React from "react";

const UserNameEmailAvatar = ({
  userName,
  userEmail,
  letter,
  isActive,
  size,
  assistantImage,
}) => {
  const getBackgroundColor = (letter) => {
    const colors = [
      "rgb(255, 159, 0)",
      "rgb(0, 180, 108)",
      "rgb(34, 102, 221)",
      "rgb(255, 62, 47)",
      "rgb(104, 109, 224)",
      "rgb(196, 58, 34)",
      "rgb(0, 166, 153)",
      "rgb(19, 77, 173)",
      "rgb(255, 87, 34)",
      "rgb(63, 81, 181)",
      "rgb(255, 133, 0)",
      "rgb(0, 150, 136)",
      "rgb(13, 71, 161)",
      "rgb(255, 47, 60)",
      "rgb(83, 109, 254)",
    ];
    const letterCode = letter?.charCodeAt(0) - 65; // Assuming uppercase letters
    const colorIndex = letterCode % colors.length;

    return colors[colorIndex];
  };

  return (
    <>
      <div className="w-full flex items-center justify-start text-gray-900 whitespace-nowrap">
        <div className="w-10">
          <div
            className={`grid place-content-center relative cursor-pointer rounded-full text-white font-normal mainForImageProperty ${
              size ? "w-8 h-8" : "w-10 h-10"
            }`}
            style={{
              background:
                assistantImage?.length > 0
                  ? `url(${assistantImage})`
                  : getBackgroundColor(letter),
            }}
          >
            <span
              className={`text-md text-center ${
                !assistantImage?.length > 0 ? "block" : "hidden"
              }`}
            >
              {letter}
            </span>
            {isActive && (
              <div className="absolute right-0 bottom-0">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            )}
          </div>
        </div>
        {userEmail && userName && (
          <div className="pl-3 flex-grow truncate" title={userEmail}>
            <div className="text-base font-semibold truncate w-fit text-black">
              {userName}
            </div>
            <div className="font-normal text-gray-500 truncate w-fit">
              {userEmail}
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .mainForImageProperty {
          background-position: center !important;
          background-size: cover !important;
          background-repeat: no-repeat !important;
        }
      `}</style>
    </>
  );
};

export default UserNameEmailAvatar;
