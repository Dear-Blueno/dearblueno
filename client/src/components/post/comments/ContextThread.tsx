import styles from "./ContextThread.module.scss";
import IComment from "types/IComment";
import { IThread } from "./CommentSection";
import Thread from "./Thread";
import CommentContext from "./CommentContext";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { approveComment } from "gateways/PostGateway";
import toast from "react-hot-toast";

export interface ContextThreadProps {
  thread: IComment;
  delay?: string;
  moderatorView?: boolean;
  setFeed?: React.Dispatch<React.SetStateAction<IComment[]>>;
}

function ContextThread(props: ContextThreadProps) {
  const queryClient = useQueryClient();
  const handleAction = async (action: boolean) => {
    const response = await approveComment(
      props.thread.postNumber,
      props.thread.commentNumber,
      action
    );
    if (response.success) {
      queryClient.setQueryData(
        ["moderatorcomments"],
        (data: InfiniteData<IComment[]> | undefined) => {
          const newData = data
            ? (JSON.parse(JSON.stringify(data)) as InfiniteData<IComment[]>)
            : undefined;
          newData?.pages.forEach(
            (_, index, array) =>
              (array[index] = array[index].filter(
                (comment) => comment._id !== props.thread._id
              ))
          );
          return newData;
        }
      );
    } else {
      toast.error((response.message as unknown as { message: string }).message);
    }
  };

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
            {/* <ApproveOrDeny
              type="comment"
              postNumber={props.thread.postNumber}
              commentNumber={props.thread.commentNumber}
            /> */}
            <button
              className={styles.ApproveButton}
              onClick={() => void handleAction(true)}
            >
              Approve
            </button>
            <button
              className={styles.DenyButton}
              onClick={() => void handleAction(false)}
            >
              Deny
            </button>
          </div>
        )}
      </div>
    </a>
  );
}

export default ContextThread;
