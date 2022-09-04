import styles from "./ContextThread.module.scss";
import IComment from "types/IComment";
import { IThread } from "./CommentSection";
import Thread from "./Thread";
import ApproveOrDeny from "../moderator/ApproveOrDeny";
import CommentContext from "./CommentContext";

export interface ContextThreadProps {
  thread: IComment;
  delay?: string;
  moderatorView?: boolean;
  setFeed?: React.Dispatch<React.SetStateAction<IComment[]>>;
}

function ContextThread(props: ContextThreadProps) {
  return (
    <a
      className={styles.ContextThreadLink}
      href={props.moderatorView ? "" : `/post/${props.thread.postNumber}`}
    >
      <div
        className={styles.ContextThread}
        style={{ animationDelay: props.delay ?? "0" }}
      >
        <CommentContext thread={props.thread} showProfilePicture />
        <Thread
          comment={props.thread as IThread}
          depth={0}
          inContext={true}
        ></Thread>
        {props.moderatorView && (
          <div className={styles.ContextThreadModeratorLinkContainer}>
            <a
              className={styles.ContextThreadModeratorLink}
              href={`/post/${props.thread.postNumber}`}
            >
              Show full context
            </a>
          </div>
        )}
        {props.moderatorView && (
          <div className={styles.ApproveOrDenyContainer}>
            <ApproveOrDeny
              type="comment"
              postNumber={props.thread.postNumber}
              commentNumber={props.thread.commentNumber}
            />
          </div>
        )}
      </div>
    </a>
  );
}

export default ContextThread;
