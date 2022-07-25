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

export const estTheDate = (date: Date) => {
  const undiffedDate = date;
  const estDate = new Date(
    undiffedDate.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const diff = undiffedDate.getTime() - estDate.getTime();
  return new Date(undiffedDate.getTime() + diff);
};
