import "./Thread.css";
import CommentReactionBar from "./CommentReactionBar";
import LikeCommentBar from "./LikeCommentBar";
import ThreadCollapser from "./ThreadCollapser";
import { IThread } from "./CommentSection";
import { useState } from "react";

function Thread(props: { comment: IThread }) {
  const [show, setShow] = useState(true);

  const toggleShow = () => {
    setShow(!show);
  };

  const nestedComments = (props.comment.children || []).map((comment) => {
    return <Thread comment={comment} />;
  });

  return (
    <div className="Thread" key={props.comment.commentNumber}>
      <div className="ProfilePicture"> </div>
      {show && <ThreadCollapser collapse={toggleShow} />}
      <div className="CommentHeader">
        <p className="CommentAuthor">{props.comment.author}</p>
        <p className="CommentDate">{props.comment.commentTime}</p>
        <LikeCommentBar />
      </div>
      {show && (
        <div className="Comment">
          <p className="CommentBody">{props.comment.content}</p>
          <CommentReactionBar reactions={props.comment.reactions} />
          {nestedComments}
        </div>
      )}
    </div>
  );
}

export default Thread;
