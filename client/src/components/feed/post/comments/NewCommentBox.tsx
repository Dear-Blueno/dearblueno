import "./NewCommentBox.css";

type NewCommentBoxProps = {
  parentCommentNumber: number;
  active: boolean;
  setActive: (active: boolean) => void;
};

function NewCommentBox(props: NewCommentBoxProps) {
  const textAreaClassName =
    props.parentCommentNumber < 0
      ? "NewCommentTextArea TopLevelComment"
      : "NewCommentTextArea";
  const inputClassName =
    props.parentCommentNumber < 0
      ? "NewCommentTemporaryInput TopLevelComment"
      : "NewCommentTemporaryInput";

  return (
    <div className="NewCommentBox">
      {props.active ? (
        <textarea
          className={textAreaClassName}
          placeholder="Write a comment..."
        ></textarea>
      ) : (
        <input
          className={inputClassName}
          onClick={() => props.setActive(true)}
          type="text"
          placeholder="Write a comment..."
        />
      )}
    </div>
  );
}

export default NewCommentBox;
