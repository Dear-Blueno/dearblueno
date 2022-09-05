import styles from "./CommentContext.module.scss";
import UserContent from "components/post/content/UserContent";
import CommentProfilePicture from "components/user/CommentProfilePicture";
import IComment from "types/IComment";

interface CommentContextProps {
  thread: IComment;
  showProfilePicture?: boolean;
}

export default function CommentContext(props: CommentContextProps) {
  const parentComment = props.thread.parentComment;
  const isReply = parentComment !== undefined;

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
                  parentComment.author
                    ? parentComment.author.profilePicture
                    : undefined
                }
              />
            </div>
          )}
          <div className={styles.CommentContextReplyAuthor}>
            {parentComment.author
              ? parentComment.author.displayName ?? parentComment.author.name
              : "Anonymous"}
          </div>
          <div className={styles.CommentContextContent}>
            <UserContent>{parentComment.content}</UserContent>
          </div>
        </>
      )}
      {!isReply && (
        <>
          <div>#{props.thread.postNumber}</div>
          <div className={styles.CommentContextContent}>
            <UserContent>{props.thread.post.content}</UserContent>
          </div>
        </>
      )}
    </div>
  );
}
