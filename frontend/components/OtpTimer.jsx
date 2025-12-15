import { useEffect, useState } from "react";

const OtpTimer = ({ setShowOtpForm }) => {
  const [timer, setTimer] = useState(2 * 60);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(countdown);

          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => {
      clearInterval(countdown);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      {timer == 0 ? (
        <span className="text-red-500 flex items-center justify-between">
          <span>Otp is expired</span>
          <p className="text-blue-600" onClick={() => setShowOtpForm(false)}>
            Resend
          </p>
        </span>
      ) : (
        <span className="text-green-600">
          Otp expired in : {formatTime(timer)} min
        </span>
      )}
    </>
  );
};

export default OtpTimer;
