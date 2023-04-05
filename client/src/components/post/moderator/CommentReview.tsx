import styles from "./CommentReview.module.scss";
import IComment from "types/IComment";
import RelativeDate from "../RelativeDate";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { approveComment } from "gateways/PostGateway";
import toast from "react-hot-toast";

export interface CommentReviewProps {
  comment: IComment;
}

function CommentReview(props: CommentReviewProps) {
  const queryClient = useQueryClient();
  const handleAction = async (action: boolean) => {
    const response = await approveComment(
      props.comment.postNumber,
      props.comment.commentNumber,
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
                (comment) => comment._id !== props.comment._id
              ))
          );
          return newData;
        }
      );
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className={styles.CommentReview}>
      <div className={styles.Header}>
        <a
          href={`/post/${props.comment.postNumber}`}
          className={styles.AuthorTitle}
        >
          <p className={styles.AuthorTitle}>
            {props.comment.parentComment
              ? `Replying to ${
                  props.comment.parentComment.author?.name ?? "Anonymous"
                } on ${props.comment.postNumber}`
              : `Replying to Post ${props.comment.postNumber}`}{" "}
            :
          </p>
        </a>
        <RelativeDate date={props.comment.commentTime} />
      </div>
      <p className={styles.AuthorCommentContent}>
        &quot;
        {props.comment.parentComment
          ? props.comment.parentComment.content.length > 40
            ? props.comment.parentComment.content.slice(0, 40) + "..."
            : props.comment.parentComment.content
          : props.comment.post.content.length > 40
          ? props.comment.post.content.slice(0, 40) + "..."
          : props.comment.post.content}
        &quot;
      </p>
      <p className={styles.AuthorTitle}>Reply :</p>
      <p className={styles.AuthorCommentContent}>
        &quot;
        {props.comment.content}
        &quot;
      </p>
      <div className={styles.ApproveOrDenyContainer}>
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
    </div>
  );
}

export default CommentReview;
