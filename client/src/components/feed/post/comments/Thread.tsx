import "./Thread.css";
import CommentReactionBar from "./comment_footer/comment_reaction_bar/CommentReactionBar";
import ThreadCollapser from "./ThreadCollapser";
import { IThread } from "./CommentSection";
import { useEffect, useState } from "react";
import NewCommentBox from "./NewCommentBox";
import { formatDistanceToNowStrict } from "date-fns";
import ReplyButton from "./comment_footer/ReplyButton";
import CommentFooterDivider from "./comment_footer/CommentFooterDivider";
import ProfilePicture from "../../../user/ProfilePicture";

type ThreadProps = {
  collapsed: boolean;
  comment: IThread;
};

function Thread(props: ThreadProps) {
  const [show, setShow] = useState(true);
  const [reactions] = useState<string[][]>(props.comment.reactions);
  const [commentAreaActive, setCommentAreaActive] = useState<boolean>(false);

  const toggleShow = () => {
    setShow(!show);
  };

  useEffect(() => {}, [reactions]);

  const nestedComments = (props.comment.children || []).map((comment) => {
    return (
      <Thread key={comment.commentNumber} collapsed={false} comment={comment} />
    );
  });

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

  const className =
    props.comment.parentCommentNumber < 0 ? "Thread TopLevelThread" : "Thread";

  return (
    <div className={className} key={props.comment.commentNumber}>
      <div className="ThreadGrid">
        <ProfilePicture link={props.comment.author.profilePicture} />
        {show && <ThreadCollapser collapse={toggleShow} />}
        <div className="CommentHeader">
          <p className="CommentAuthor">{props.comment.author.name}</p>
          <p className="CommentDate">
            {formatDuration(
              formatDistanceToNowStrict(new Date(props.comment.commentTime))
            )}
          </p>
        </div>
        {show && (
          <div className="Comment">
            <p className="CommentBody">{props.comment.content}</p>
            <div className="CommentFooter">
              {show && (
                <CommentReactionBar reactions={props.comment.reactions} />
              )}
              <CommentFooterDivider />
              {show && <ReplyButton click={() => {}} />}
            </div>
            {nestedComments}
          </div>
        )}
      </div>
      <NewCommentBox
        parentCommentNumber={props.comment.commentNumber}
        active={commentAreaActive}
        setActive={setCommentAreaActive}
        show={false}
      />
    </div>
  );
}

export default Thread;
