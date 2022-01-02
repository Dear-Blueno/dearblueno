import "./Thread.css";
import ReactionBar from "../reactions/ReactionBar";
import ThreadCollapser from "./ThreadCollapser";
import { IThread } from "./CommentSection";
import { useEffect, useState } from "react";
import NewCommentBox from "./new_comment/NewCommentBox";
import CommentButton from "../CommentButton";
import DividerDot from "../DividerDot";
import CommentProfilePicture from "../../../user/CommentProfilePicture";
import CommentHeader from "./comment_header/CommentHeader";
import IUser from "../../../../types/IUser";

type ThreadProps = {
  user: IUser | undefined;
  collapsed: boolean;
  comment: IThread;
  firstThread: boolean;
  postNumber: number;
};

function Thread(props: ThreadProps) {
  const [show, setShow] = useState(true);
  const [showReplyBox, setShowReplyBox] = useState(false);
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
        postNumber={props.postNumber}
      />
    );
  });

  const className = props.firstThread ? "Thread FirstThread" : "Thread";

  return (
    <div className={className} key={props.comment.commentNumber}>
      <div className="ThreadGrid">
        <CommentProfilePicture link={props.comment.author.profilePicture} />
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
              <ReactionBar
                postNumber={props.comment.postNumber}
                commentNumber={props.comment.commentNumber}
                user={props.user}
                type="comment"
                reactions={props.comment.reactions}
              />
              <DividerDot />
              <CommentButton type="reply" click={() => setShowReplyBox(true)} />
            </div>
            {showReplyBox && (
              <NewCommentBox
                user={props.user}
                firstComment={false}
                postNumber={props.postNumber}
                parentCommentNumber={props.comment.commentNumber}
                setShow={setShowReplyBox}
              />
            )}
            {nestedComments}
          </div>
        )}
      </div>
    </div>
  );
}

export default Thread;
