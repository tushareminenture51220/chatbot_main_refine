import { useState, useEffect } from "react";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (isToday) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    return `Today, ${formattedHours}:${
      minutes < 10 ? "0" : ""
    }${minutes}${ampm}`;
  } else {
    const dayOfWeek = daysOfWeek[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    return `${dayOfWeek}, ${formattedHours}:${
      minutes < 10 ? "0" : ""
    }${minutes}${ampm}`;
  }
};

const MsgTimeFormat = ({ timestamp }) => {
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    setFormattedTime(formatDate(timestamp));
  }, [timestamp]);
  return <span>{formattedTime}</span>;
};

export default MsgTimeFormat;
