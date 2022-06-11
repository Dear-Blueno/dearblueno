import styles from "./ContextThread.module.scss";
import IComment from "types/IComment";
import IUser from "types/IUser";
import { IThread } from "./CommentSection";
import Thread from "./Thread";
import ApproveOrDeny from "../moderator/ApproveOrDeny";
import { approveComment } from "gateways/PostGateway";
import CommentContext from "./CommentContext";

export type ContextThreadProps = {
  user?: IUser;
  thread: IComment;
  delay?: string;
  moderatorView?: boolean;
  setFeed?: React.Dispatch<React.SetStateAction<IComment[]>>;
};

function ContextThread(props: ContextThreadProps) {
  return (
    <a
      className={styles.ContextThreadLink}
      href={props.moderatorView ? "" : "/post/" + props.thread.postNumber}
    >
      <div
        className={styles.ContextThread}
        style={{ animationDelay: props.delay ?? "0" }}
      >
        <CommentContext thread={props.thread} showProfilePicture />
        <Thread
          collapsed={false}
          comment={props.thread as IThread}
          depth={0}
          inContext={true}
        ></Thread>
        {props.moderatorView && (
          <div className={styles.ContextThreadModeratorLinkContainer}>
            <a
              className={styles.ContextThreadModeratorLink}
              href={"/post/" + props.thread.postNumber}
            >
              Show full context
            </a>
          </div>
        )}
        {props.moderatorView && (
          <div className={styles.ApproveOrDenyContainer}>
            <ApproveOrDeny
              type="comment"
              approve={async () => {
                const response = await approveComment(
                  props.thread.postNumber,
                  props.thread.commentNumber,
                  true
                );
                if (response.success && props.setFeed) {
                  props.setFeed((comments) =>
                    comments.filter((c) => c._id !== props.thread._id)
                  );
                }
              }}
              deny={async () => {
                const response = await approveComment(
                  props.thread.postNumber,
                  props.thread.commentNumber,
                  false
                );
                if (response.success && props.setFeed) {
                  props.setFeed((comments) =>
                    comments.filter((c) => c._id !== props.thread._id)
                  );
                }
              }}
            />
          </div>
        )}
      </div>
    </a>
  );
}

export default ContextThread;
