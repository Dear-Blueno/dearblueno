import { commentOnPost } from "../../../../../gateways/PostGateway";
import IUser from "../../../../../types/IUser";
import { FeedContext } from "../../../Feed";
import "./NewCommentBox.css";
import NewCommentBoxFooter from "./NewCommentBoxFooter";
import { useState, useRef, useContext } from "react";

type NewCommentBoxProps = {
  user: IUser | undefined;
  firstComment: boolean;
  postNumber: number;
  parentCommentNumber: number;
  setShow: (show: boolean) => void;
};

function NewCommentBox(props: NewCommentBoxProps) {
  const refreshPost = useContext(FeedContext).refreshPost;
  const [anonymous, setAnonymous] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const submit = async () => {
    if (props.user) {
      const textarea = textAreaRef.current;
      if (textarea && textarea.value) {
        await commentOnPost(
          props.postNumber,
          textarea.value,
          props.parentCommentNumber,
          anonymous
        );
        textarea.value = "";
        props.setShow(false);
        refreshPost(props.postNumber);
      }
    }
  };

  return (
    <div className="NewCommentBox">
      <textarea
        autoFocus
        className="NewCommentTextArea"
        placeholder="Write a comment..."
        ref={textAreaRef}
      ></textarea>
      <NewCommentBoxFooter
        submit={submit}
        anonymous={anonymous}
        anonymousToggle={() => setAnonymous(!anonymous)}
        textAreaRef={textAreaRef}
        setShow={props.setShow}
      />
    </div>
  );
}

export default NewCommentBox;
