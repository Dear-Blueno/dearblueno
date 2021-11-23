import "./Thread.css";
import CommentReactionBar from "./comment_footer/comment_reaction_bar/CommentReactionBar";
import ThreadCollapser from "./ThreadCollapser";
import { IThread } from "./CommentSection";
import { useEffect, useState } from "react";
import NewCommentBox from "./NewCommentBox";
import { formatDistanceToNowStrict } from "date-fns";
import ReplyButton from "./comment_footer/ReplyButton";
import CommentFooterDivider from "./comment_footer/CommentFooterDivider";

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
    return <Thread collapsed={false} comment={comment} />;
  });

  const formatDuration = (duration: string) => {
    if (duration.includes(" seconds")) {
      return duration.replace(" seconds", "s");
    } else if (duration.includes(" minutes")) {
      return duration.replace(" minutes", "m");
    } else if (duration.includes(" hours")) {
      return duration.replace(" hours", "h");
    } else if (duration.includes(" days")) {
      return duration.replace(" days", "d");
    } else if (duration.includes(" months")) {
      return duration.replace(" months", "mo");
    } else if (duration.includes(" years")) {
      return duration.replace(" years", "y");
    } else {
      return duration;
    }
  };

  const className =
    props.comment.parentCommentNumber < 0 ? "Thread TopLevelThread" : "Thread";

  return (
    <div className={className} key={props.comment.commentNumber}>
      <div className="ThreadGrid">
        <div className="ProfilePicture"> </div>
        {show && <ThreadCollapser collapse={toggleShow} />}
        <div className="CommentHeader">
          <p className="CommentAuthor">{props.comment.author}</p>
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
