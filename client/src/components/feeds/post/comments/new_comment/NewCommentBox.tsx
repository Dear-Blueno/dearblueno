import { commentOnPost } from "gateways/PostGateway";
import IUser from "types/IUser";
import "./NewCommentBox.css";
import NewCommentBoxFooter from "./NewCommentBoxFooter";
import { useState, useRef } from "react";
import { IThread } from "../CommentSection";

type NewCommentBoxProps = {
  user: IUser | undefined;
  firstComment: boolean;
  postNumber: number;
  parentCommentNumber: number;
  setShow: (show: boolean) => void;
  setComments: React.Dispatch<React.SetStateAction<IThread[]>>;
};

const findParent = (
  comments: IThread[],
  parentCommentNumber: number
): IThread | undefined => {
  for (const comment of comments) {
    if (comment.commentNumber === parentCommentNumber) {
      return comment;
    }
    const parent = findParent(comment.children, parentCommentNumber);
    if (parent) {
      return parent;
    }
  }
  return undefined;
};

function NewCommentBox(props: NewCommentBoxProps) {
  const [anonymous, setAnonymous] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const submit = async () => {
    if (props.user) {
      const textarea = textAreaRef.current;
      if (textarea && textarea.value) {
        const response = await commentOnPost(
          props.postNumber,
          textarea.value,
          props.parentCommentNumber,
          anonymous
        );
        if (response.success && response.payload) {
          textarea.value = "";
          props.setShow(false);
          props.setComments((comments) => {
            const newComments = [...comments];
            if (response.payload) {
              const comment = response.payload as IThread;
              comment.children = [];
              comment.author = props.user;
              const parent = findParent(newComments, props.parentCommentNumber);
              if (parent) {
                parent.children.push(comment);
              } else {
                newComments.push(comment);
              }
            }
            return newComments;
          });
        }
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
