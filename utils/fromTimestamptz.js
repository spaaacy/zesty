export function fromTimestamptz(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  };
  return dateTime.toLocaleString("en-US", options);
}
