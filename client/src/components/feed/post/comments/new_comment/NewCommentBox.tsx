import { commentOnPost } from "../../../../../gateways/PostGateway";
import IUser from "../../../../../types/IUser";
import "./NewCommentBox.css";
import NewCommentBoxFooter from "./NewCommentBoxFooter";

type NewCommentBoxProps = {
  user: IUser | undefined;
  firstComment: boolean;
  postNumber: number;
  parentCommentNumber: number;
  setShow: (show: boolean) => void;
};

function NewCommentBox(props: NewCommentBoxProps) {
  let textAreaClassName = "NewCommentTextArea";
  if (props.firstComment) {
    textAreaClassName += " FirstCommentBox";
  }
  if (props.parentCommentNumber < 0) {
    textAreaClassName += " TopLevelCommentBox";
  }

  const id = "newCommentTextArea" + props.parentCommentNumber;

  const submit = () => {
    if (props.user) {
      const textarea = document.getElementById(id) as HTMLTextAreaElement;
      if (textarea && textarea.value) {
        commentOnPost(
          props.postNumber,
          textarea.value,
          props.parentCommentNumber
        ).then((response) => {
          console.log(response);
        });
        textarea.value = "";
        props.setShow(false);
      }
    }
  };

  return (
    <div className="NewCommentBox">
      <textarea
        autoFocus
        className={textAreaClassName}
        placeholder="Write a comment..."
        id={id}
      ></textarea>
      <NewCommentBoxFooter submit={submit} />
    </div>
  );
}

export default NewCommentBox;
