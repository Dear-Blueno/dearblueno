import styles from "./RelativeDate.module.scss";
import {
  formatDistanceToNowStrict,
  differenceInMilliseconds,
  addMinutes,
  differenceInMinutes,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";

interface RelativeDateProps {
  date: string;
}

const formatDuration = (duration: string) => {
  if (duration.includes(" second")) {
    return "0m";
  } else if (duration.includes(" minutes")) {
    return duration.replace(" minutes", "m");
  } else if (duration.includes(" minute")) {
    return duration.replace(" minute", "m");
  } else if (duration.includes(" hours")) {
    return duration.replace(" hours", "h");
  } else if (duration.includes(" hour")) {
    return duration.replace(" hour", "h");
  } else if (duration.includes(" days")) {
    return duration.replace(" days", "d");
  } else if (duration.includes(" day")) {
    return duration.replace(" day", "d");
  } else if (duration.includes(" months")) {
    return duration.replace(" months", "mo");
  } else if (duration.includes(" month")) {
    return duration.replace(" month", "mo");
  } else if (duration.includes(" years")) {
    return duration.replace(" years", "y");
  } else if (duration.includes(" year")) {
    return duration.replace(" year", "y");
  } else {
    return duration;
  }
};

function RelativeDate(props: RelativeDateProps) {
  const date = useMemo(() => new Date(props.date), [props.date]);

  const [trigger, setTrigger] = useState(0);
  useEffect(() => {
    const now = new Date();
    const token = setTimeout(
      () => setTrigger((n) => n + 1),
      differenceInMilliseconds(
        now,
        addMinutes(
          date,
          differenceInMinutes(now, date, { roundingMethod: "ceil" })
        )
      )
    );
    return () => clearTimeout(token);
  }, [trigger, date]);

  return (
    <time
      className={styles.RelativeDate}
      dateTime={props.date}
      title={date.toLocaleString()}
    >
      {formatDuration(formatDistanceToNowStrict(date))}
    </time>
  );
}

export default RelativeDate;
