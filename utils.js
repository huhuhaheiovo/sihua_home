

/**
 * Get today's date and time, formatted as YYYY-MM-DD HH:MM:SS.
 */
 function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const hour = today.getHours();
  const minute = today.getMinutes();
  const seconds = today.getSeconds();
  return `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day} ${hour < 10 ? "0" : ""}${hour}:${minute < 10 ? "0" : ""}${minute}:${seconds < 10 ? "0" : ""}${seconds}`;
}

