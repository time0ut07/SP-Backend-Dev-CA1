function formatTimestamp(timestamp) {
  const dateObj = new Date(timestamp);
  const hours = String(dateObj.getUTCHours()).padStart(2, "0");
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getUTCSeconds()).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = dateObj.getUTCFullYear();

  const formattedDate = `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
  return formattedDate;
}
