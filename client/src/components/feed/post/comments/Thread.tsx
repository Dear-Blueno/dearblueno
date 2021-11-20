import "./Thread.css";
import CommentReactionBar from "./CommentReactionBar";
import LikeCommentBar from "./LikeCommentBar";
import ThreadCollapser from "./ThreadCollapser";
import { Comment } from "./CommentSection";
import { useEffect, useState } from "react";

function Thread(props: { comment: Comment }) {
  const [show, setShow] = useState(true);

  const toggleShow = () => {
    setShow(!show);
  };

  const nestedComments = (props.comment.children || []).map((comment) => {
    return <Thread comment={comment} />;
  });

  return (
    <div className="Thread" key={props.comment.id}>
      <div className="ProfilePicture"> </div>
      {show && <ThreadCollapser collapse={toggleShow} />}
      <div className="CommentHeader">
        <p className="CommentAuthor">{props.comment.author}</p>
        <p className="CommentDate">{props.comment.date}</p>
        <LikeCommentBar />
      </div>
      {show && (
        <div className="Comment">
          <p className="CommentBody">{props.comment.body}</p>
          <CommentReactionBar reactions={props.comment.reactions} />
          {nestedComments}
        </div>
      )}
    </div>
  );
}

export default Thread;
