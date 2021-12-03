import "./NewCommentBox.css";

type NewCommentBoxProps = {
  firstComment: boolean;
  parentCommentNumber: number;
  show: boolean;
};

function NewCommentBox(props: NewCommentBoxProps) {
  let textAreaClassName = "NewCommentTextArea";
  if (props.firstComment) {
    textAreaClassName += " FirstCommentBox";
  }
  if (props.parentCommentNumber < 0) {
    textAreaClassName += " TopLevelCommentBox";
  }

  return (
    <div className="NewCommentBox">
      {props.show ? (
        <textarea
          autoFocus
          className={textAreaClassName}
          placeholder="Write a comment..."
        ></textarea>
      ) : null}
    </div>
  );
}

export default NewCommentBox;
