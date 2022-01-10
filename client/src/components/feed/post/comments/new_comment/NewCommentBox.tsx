import { useContext } from "react";
import { commentOnPost } from "../../../../../gateways/PostGateway";
import IUser from "../../../../../types/IUser";
import { FeedContext } from "../../../Feed";
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

  const refreshPosts = useContext(FeedContext).refreshPosts;

  const submit = async () => {
    if (props.user) {
      const textarea = document.getElementById(id) as HTMLTextAreaElement;
      if (textarea && textarea.value) {
        await commentOnPost(
          props.postNumber,
          textarea.value,
          props.parentCommentNumber
        );
        textarea.value = "";
        props.setShow(false);
        refreshPosts();
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
