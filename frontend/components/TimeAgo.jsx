import React, { useMemo } from "react";

function TimeAgo({ timestamp }) {
  const timeDifference = useMemo(() => {
    const currentDate = new Date();
    const targetDate = new Date(timestamp);
    // Check if the timestamp is a valid date
    if (isNaN(targetDate)) {
      return null; // or return a default value, depending on your use case
    }
    return Math.max(1000, currentDate - targetDate); // Ensure a minimum of 1000 milliseconds
  }, [timestamp]);

  // Check if timeDifference is null, indicating an invalid timestamp
  if (timeDifference === null) {
    return "Invalid date";
  }

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);

  if (seconds < 60) {
    return "just now";
  } else if (minutes === 1) {
    return `${minutes}m`;
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (hours < 24) {
      return `${hours}h`;
    } else if (days < 7) {
      return `${days}d`;
    } else if (weeks < 4) {
      return `${weeks}w`;
    } else if (months < 12) {
      return `${months}mo`;
    } else {
      return `${years}y`;
    }
  }
}

export default TimeAgo;
