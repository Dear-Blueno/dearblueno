import styles from "./CommentContext.module.scss";
import UserContent from "components/post/content/UserContent";
import CommentProfilePicture from "components/user/CommentProfilePicture";
import IComment from "types/IComment";

type CommentContextProps = {
  thread: IComment;
  showProfilePicture?: boolean;
};

export default function CommentContext(props: CommentContextProps) {
  const isReply = props.thread.parentComment !== undefined;

  return (
    <div className={styles.CommentContext}>
      <div className={styles.CommentContextConnectorContainer}>
        <div className={styles.CommentContextConnector}></div>
      </div>
      {isReply && (
        <>
          {props.showProfilePicture && (
            <div className={styles.CommentContextParentPicture}>
              <CommentProfilePicture
                link={
                  props.thread.parentComment.author
                    ? props.thread.parentComment.author.profilePicture
                    : undefined
                }
              />
            </div>
          )}
          <div className={styles.CommentContextReplyAuthor}>
            {props.thread.parentComment.author
              ? props.thread.parentComment.author.name
              : "Anonymous"}
          </div>
          <div className={styles.CommentContextReplyText}>
            <UserContent>
              {props.thread.parentComment.content.substring(0, 10) +
                (props.thread.parentComment.content.length > 10 ? "…" : "")}
            </UserContent>
          </div>
        </>
      )}
      {!isReply && (
        <>
          <div className={styles.CommentContextPostNumber}>
            #{props.thread.postNumber}
          </div>
          <div className={styles.CommentContextPostContent}>
            {(props.thread.post.content as string).substring(0, 70)}
            {(props.thread.post.content as string).length > 70 ? "…" : ""}
          </div>
        </>
      )}
    </div>
  );
}
