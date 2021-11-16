import "./Comment.css";

interface CommentProps {
    author: string;
    body: string;
    date: string;
    depth: number;
}

function Comment(props : CommentProps) {
  const style = {
    left: props.depth + "rem",
    width: "calc(100% - " + props.depth + "rem - 1.6rem)"
  };
    return (
      <div className="Comment" style={style}>
          <h4 className="CommentAuthor">{props.author}</h4>
          <p className="CommentBody">{props.body}</p>
      </div>
    );
  }
  
  export default Comment;