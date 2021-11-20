import "./Thread.css";
import CommentReactionBar from "./CommentReactionBar";
import { Comment } from "./CommentSection";

function Thread(props: { comment: Comment }) {
  const nestedComments = (props.comment.children || []).map((comment) => {
    return <Thread comment={comment} />;
  }); 

  return (
    <div className="Thread" key={props.comment.id}>
      <div className="Comment">
        <div className="CommentHeader">
          <p className="CommentAuthor">{props.comment.author}</p>
          <p className="CommentDate">{props.comment.date}</p>
        </div>
        <p className="CommentBody">{props.comment.body}</p>
        <CommentReactionBar reactions={props.comment.reactions} />
      </div>
      {nestedComments}
    </div>
  );
}

export default Thread;
