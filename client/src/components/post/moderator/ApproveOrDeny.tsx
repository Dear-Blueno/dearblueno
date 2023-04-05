import styles from "./ApproveOrDeny.module.scss";
import { useRef } from "react";
import { approveComment, approvePost } from "gateways/PostGateway";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import IPost from "types/IPost";
import toast from "react-hot-toast";
import IComment from "types/IComment";

interface PostProps {
  type: "post";
  postId: string;
}

interface CommentProps {
  type: "comment";
  postNumber: number;
  commentNumber: number;
}

interface EventProps {
  type: "event";
  eventId: string;
}

type ApproveOrDenyProps = PostProps | CommentProps | EventProps;

function ApproveOrDeny(props: ApproveOrDenyProps) {
  const queryClient = useQueryClient();
  const contentWarningInputRef = useRef<HTMLInputElement>(null);
  const approveOrDeny = (bool: boolean) => {
    switch (props.type) {
      case "post":
        return async () => {
          const response = await approvePost(
            props.postId,
            bool,
            contentWarningInputRef.current?.value
          );
          if (response.success) {
            queryClient.setQueryData(
              ["moderatorposts"],
              (data: InfiniteData<IPost[]> | undefined) => {
                const newData = data
                  ? (JSON.parse(JSON.stringify(data)) as InfiniteData<IPost[]>)
                  : undefined;
                newData?.pages.forEach(
                  (_, index, array) =>
                    (array[index] = array[index].filter(
                      (post) => post._id !== props.postId
                    ))
                );
                return newData;
              }
            );
          } else {
            toast.error(response.message);
          }
        };
      case "comment":
        return async () => {
          const response = await approveComment(
            props.postNumber,
            props.commentNumber,
            bool
          );
          if (response.success) {
            queryClient.setQueryData(
              ["moderatorcomments"],
              (data: InfiniteData<IComment[]> | undefined) => {
                const newData = data
                  ? (JSON.parse(JSON.stringify(data)) as InfiniteData<
                      IComment[]
                    >)
                  : undefined;
                newData?.pages.forEach(
                  (_, index, array) =>
                    (array[index] = array[index].filter(
                      (comment) =>
                        comment.postNumber !== props.postNumber ||
                        comment.commentNumber !== props.commentNumber
                    ))
                );
                return newData;
              }
            );
          } else {
            toast.error(response.message);
          }
        };
    }
  };

  const approve = approveOrDeny(true);
  const deny = approveOrDeny(false);

  if (!approve) return null;
  if (!deny) return null;

  return (
    <div>
      {props.type === "post" && (
        <input
          className={styles.ApproveDenyBox}
          ref={contentWarningInputRef}
          type="text"
          placeholder="Content Warning"
        />
      )}
      <div className={styles.ApproveOrDeny}>
        <button
          className={styles.ApproveOrDenyButton + " " + styles.ApproveButton}
          onClick={() => {
            console.log("approve post");
            void approve();
          }}
        >
          Approve
        </button>
        <button
          className={styles.ApproveOrDenyButton + " " + styles.DenyButton}
          onClick={() => void deny()}
        >
          Deny
        </button>
      </div>
    </div>
  );
}

export default ApproveOrDeny;
