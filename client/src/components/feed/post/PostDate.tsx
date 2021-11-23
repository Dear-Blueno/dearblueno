import "./PostDate.css";
import { formatDistanceToNowStrict, isSameDay } from "date-fns";

interface PostDateProps {
  value: string;
}

function PostDate(props: PostDateProps) {
  const formatDuration = (duration: string) => {
    if (duration.includes(" seconds")) {
      return duration.replace(" seconds", "s");
    } else if (duration.includes(" second")) {
      return duration.replace(" second", "s");
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

  const date = isSameDay(new Date(props.value), new Date())
    ? new Date(props.value).toLocaleTimeString()
    : formatDuration(formatDistanceToNowStrict(new Date(props.value)));

  return (
    <div className="PostDate">
      <p>{date}</p>
    </div>
  );
}

export default PostDate;
