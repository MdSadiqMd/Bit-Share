const formatDateTime = (dateTimeString: string) => {
  const dateTime = new Date(dateTimeString);
  const date = `${dateTime.getDate().toString().padStart(2, "0")}-${(
    dateTime.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${dateTime.getFullYear()}`;
  const time = `${dateTime.getHours().toString().padStart(2, "0")}:${dateTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${dateTime.getSeconds().toString().padStart(2, "0")}`;
  return `${time}, ${date}`;
};

export default formatDateTime;
