import "./CommentHeader.css";
import CommentMenuButton from "./CommentMenuButton";
import { IThread } from "../CommentSection";
import { formatDistanceToNowStrict } from "date-fns";

type CommentHeaderProps = {
  comment: IThread;
  collapsed: boolean;
  expand: () => void;
};

function CommentHeader(props: CommentHeaderProps) {
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

  return (
    <div className="CommentHeader">
      <p className="CommentAuthor">{props.comment.author.name}</p>
      <p className="CommentDate">
        {formatDuration(
          formatDistanceToNowStrict(new Date(props.comment.commentTime))
        )}
      </p>

      {props.collapsed && (
        <p className="ExpandThreadButton" onClick={props.expand}>
          expand
        </p>
      )}

      <CommentMenuButton />
    </div>
  );
}

export default CommentHeader;
