import styles from "./NewCommentBox.module.scss";
import { commentOnPost } from "gateways/PostGateway";
import NewCommentBoxFooter from "./NewCommentBoxFooter";
import { useState, useRef, useCallback } from "react";
import { IThread } from "../CommentSection";
import { useIsMobile } from "hooks/is-mobile";
import AnonymousToggle from "./AnonymousToggle";
import useUser from "hooks/useUser";
import toast from "react-hot-toast";

interface NewCommentBoxProps {
  firstComment: boolean;
  postNumber: number;
  parentCommentNumber: number;
  setShow: (show: boolean) => void;
  setComments: React.Dispatch<React.SetStateAction<IThread[]>>;
}

export const findComment = (
  comments: IThread[],
  commentNumber: number
): IThread | undefined => {
  for (const comment of comments) {
    if (comment.commentNumber === commentNumber) {
      return comment;
    }
    const found = findComment(comment.children, commentNumber);
    if (found) {
      return found;
    }
  }
  return undefined;
};

function NewCommentBox(props: NewCommentBoxProps) {
  const { user } = useUser();
  const [anonymous, setAnonymous] = useState(false);
  const anonymousToggle = useCallback(() => setAnonymous((prev) => !prev), []);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const submit = async () => {
    if (user) {
      const textarea = textAreaRef.current;
      if (textarea?.value && textarea.value.length >= 2000) {
        toast.error(`${textarea.value.length - 2000} characters over limit`);
        return false;
      }
      if (textarea?.value) {
        const response = await commentOnPost(
          props.postNumber,
          textarea.value,
          props.parentCommentNumber,
          anonymous
        );
        if (response.success) {
          const commentOrReply =
            props.parentCommentNumber === -1 ? "Comment" : "Reply";
          toast.success(
            anonymous
              ? `${commentOrReply} submitted for approval!`
              : `${commentOrReply} published!`
          );
          textarea.value = "";
          props.setShow(false);
          props.setComments((comments) => {
            const newComments = [...comments];
            const comment = response.payload as IThread;
            comment.children = [];
            comment.author = anonymous ? undefined : user;
            if (anonymous) {
              comment.content = "[under review]";
            }
            const parent = findComment(newComments, props.parentCommentNumber);
            if (parent) {
              parent.children.push(comment);
            } else {
              newComments.push(comment);
            }
            return newComments;
          });
          return true;
        }
        toast.error(
          (response.message as unknown as { message: string }).message
        );
        return false;
      }
      return false;
    }
    return false;
  };

  return (
    <div className={styles.NewCommentBox}>
      {isMobile && (
        <AnonymousToggle
          anonymous={anonymous}
          anonymousToggle={anonymousToggle}
          top
        />
      )}
      <textarea
        autoFocus
        className={styles.NewCommentTextArea}
        placeholder="Write a comment..."
        ref={textAreaRef}
      ></textarea>
      <NewCommentBoxFooter
        submit={submit}
        anonymous={anonymous}
        anonymousToggle={anonymousToggle}
        textAreaRef={textAreaRef}
        setShow={props.setShow}
      />
    </div>
  );
}

export default NewCommentBox;
