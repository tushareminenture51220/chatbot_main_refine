import React, { useRef } from "react";

const OtpInput = ({ pinValue, onPinChange }) => {
  const inputRefs = Array.from({ length: 6 }, () => useRef(null));

  const handleInputChange = (index, e) => {
    const newValue = e.target.value;

    // Update the pin value with the entered digit
    const newPinValue = pinValue.split("");
    newPinValue[index] = newValue;
    onPinChange(newPinValue.join(""));

    // Focus on the next input
    if (index < 5 && newValue !== "") {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && !e.target.value) {
      // If backspace key is pressed, focus on the previous input
      inputRefs[index - 1].current.focus();
    }
  };

  const handleKeyPress = (index, e) => {
    // Allow only numbers
    const isNumber = /^[0-9]$/;

    if (!isNumber.test(e.key)) {
      e.preventDefault();
    } else {
      // Update the current input
      inputRefs[index].current.value = e.key;
      handleInputChange(index, e);
    }
  };

  return (
    <div className="flex justify-center items-center w-fit h-fit">
      {Array.from({ length: 6 }, (_, index) => (
        <input
          key={index}
          placeholder="0"
          ref={inputRefs[index]}
          type="tel"
          maxLength="1"
          className="appearance-none rounded-md my-2 focus:outline-none border border-gray-300 p-2 text-center w-10 h-10 mx-1 focus:border-blue-500"
          onChange={(e) => handleInputChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onKeyPress={(e) => handleKeyPress(index, e)}
          required
        />
      ))}
    </div>
  );
};

export default OtpInput;
