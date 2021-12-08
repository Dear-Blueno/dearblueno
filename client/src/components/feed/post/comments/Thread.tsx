import "./Thread.css";
import ReactionBar from "../reactions/ReactionBar";
import ThreadCollapser from "./ThreadCollapser";
import { IThread } from "./CommentSection";
import { useEffect, useState } from "react";
import NewCommentBox from "./NewCommentBox";
import CommentButton from "../CommentButton";
import DividerDot from "../DividerDot";
import ProfilePicture from "../../../user/ProfilePicture";
import CommentHeader from "./comment_header/CommentHeader";
import IUser from "../../../../types/IUser";

type ThreadProps = {
  user: IUser | undefined;
  collapsed: boolean;
  comment: IThread;
  firstThread: boolean;
};

function Thread(props: ThreadProps) {
  const [show, setShow] = useState(true);
  const [reactions] = useState<string[][]>(props.comment.reactions);

  const toggleShow = () => {
    setShow(!show);
  };

  useEffect(() => {}, [reactions]);

  const nestedComments = (props.comment.children || []).map((comment) => {
    return (
      <Thread
        user={props.user}
        key={comment.commentNumber}
        collapsed={false}
        comment={comment}
        firstThread={false}
      />
    );
  });

  const className = props.firstThread ? "Thread FirstThread" : "Thread";

  return (
    <div className={className} key={props.comment.commentNumber}>
      <div className="ThreadGrid">
        <ProfilePicture link={props.comment.author.profilePicture} />
        {show && <ThreadCollapser collapse={toggleShow} />}
        <CommentHeader
          comment={props.comment}
          collapsed={!show}
          expand={() => setShow(true)}
        />
        {show && (
          <div className="Comment">
            <p className="CommentBody">{props.comment.content}</p>
            <div className="CommentFooter">
              {show && (
                <ReactionBar
                  user={props.user}
                  type="comment"
                  reactions={props.comment.reactions}
                />
              )}
              <DividerDot />
              {show && <CommentButton type="reply" click={() => {}} />}
            </div>
            {nestedComments}
          </div>
        )}
      </div>
      <NewCommentBox
        user={props.user}
        firstComment={props.firstThread}
        parentCommentNumber={props.comment.commentNumber}
        show={false}
      />
    </div>
  );
}

export default Thread;
