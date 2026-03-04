export const formatUtcTimeToLocal = (timeStr: string | undefined | null): string => {
  if (!timeStr || timeStr.trim() === "" || timeStr === "00:00:00") {
    return "N/A";
  }

  const parts = timeStr.split(":");
  if (parts.length < 2) return "N/A";

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes) || hours > 23 || minutes > 59) {
    return "N/A";
  }

  const utcDate = new Date();
  utcDate.setUTCHours(hours, minutes, 0, 0);

  return utcDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};