import format from "date-fns/format";
import isToday from "date-fns/isToday";
import isTomorrow from "date-fns/isTomorrow";

export const makeDate = (date: string) => {
  const dateArray = date.split("-");
  const year = parseInt(dateArray[0]);
  const month = parseInt(dateArray[1]);
  const day = parseInt(dateArray[2]);
  const newDate = new Date(year, month - 1, day);
  if (isToday(newDate)) {
    return "Today";
  }
  if (isTomorrow(newDate)) {
    return "Tomorrow";
  }
  return format(newDate, "MMMM d");
};

export const makeTime = (startTime: string, endTime: string) => {
  const startTimeArray = startTime.split(":");
  const endTimeArray = endTime.split(":");
  const arbitraryStartDate = new Date(
    0,
    0,
    0,
    parseInt(startTimeArray[0]),
    parseInt(startTimeArray[1])
  );
  const arbitraryEndDate = new Date(
    0,
    0,
    0,
    parseInt(endTimeArray[0]),
    parseInt(endTimeArray[1])
  );
  const startTimeString = format(arbitraryStartDate, "h:mma");
  const endTimeString = format(arbitraryEndDate, "h:mma");
  return `${startTimeString} - ${endTimeString}`;
};
