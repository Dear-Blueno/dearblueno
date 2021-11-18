import "./Thread.css";
import { Comment } from "./CommentSection";

function Thread(props: { comment: Comment }) {
  const nestedComments = (props.comment.children || []).map((comment) => {
    return <Thread comment={comment} />;
  });

  return (
    <div className="Comment" key={props.comment.id}>
      <div className="CommentHeader">
        <p className="CommentAuthor">{props.comment.author}</p>
        <p className="CommentDate">{props.comment.date}</p>
      </div>
      <p className="CommentBody">{props.comment.body}</p>
      {nestedComments}
    </div>
  );
}

export default Thread;
