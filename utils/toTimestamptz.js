export function toTimestampTz(date, time) {
  const datePart = new Date(date).toISOString().split("T")[0];
  const dateTimeString = `${datePart}T${time}:00.000Z`;
  const timestampTz = new Date(dateTimeString);
  return timestampTz.toISOString();
}
