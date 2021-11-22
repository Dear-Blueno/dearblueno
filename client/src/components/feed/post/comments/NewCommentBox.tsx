import "./NewCommentBox.css";

type NewCommentBoxProps = {
  active: boolean;
  setActive: (active: boolean) => void;
};

function NewCommentBox(props: NewCommentBoxProps) {
  return (
    <div className="NewCommentBox">
      {props.active ? (
        <textarea
          className="NewCommentTextArea"
          placeholder="Write a comment..."
        ></textarea>
      ) : (
        <input
          className="NewCommentTemporaryInput"
          onClick={() => props.setActive(true)}
          type="text"
          placeholder="Write a comment..."
        />
      )}
    </div>
  );
}

export default NewCommentBox;
