import { useContext } from "react";
import { commentOnPost } from "../../../../../gateways/PostGateway";
import IUser from "../../../../../types/IUser";
import { FeedContext } from "../../../Feed";
import "./NewCommentBox.css";
import NewCommentBoxFooter from "./NewCommentBoxFooter";
import { useState } from "react";

type NewCommentBoxProps = {
  user: IUser | undefined;
  firstComment: boolean;
  postNumber: number;
  parentCommentNumber: number;
  setShow: (show: boolean) => void;
};

function NewCommentBox(props: NewCommentBoxProps) {
  const id = "newCommentTextArea" + props.parentCommentNumber;

  const refreshPosts = useContext(FeedContext).refreshPosts;
  const [anonymous, setAnonymous] = useState(false);

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
        className="NewCommentTextArea"
        placeholder="Write a comment..."
        id={id}
      ></textarea>
      <NewCommentBoxFooter submit={submit} anonymous={anonymous} anonymousToggle={() => setAnonymous(!anonymous)}/>
    </div>
  );
}

export default NewCommentBox;
