import styles from "./Post.module.scss";
import ContentWarning from "./ContentWarning";
import RelativeDate from "./RelativeDate";
import PostNumber from "./content/PostNumber";
import ApproveOrDeny from "./moderator/ApproveOrDeny";
import { approvePost } from "gateways/PostGateway";
import IPost from "types/IPost";
import { RiShieldCheckFill } from "react-icons/ri";
import UserContent from "./content/UserContent";
import { AiFillPushpin } from "react-icons/ai";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface ModeratorPostProps {
  post: IPost;
}

function ModeratorPost(props: ModeratorPostProps) {
  const queryClient = useQueryClient();
  const approveOrDeny = async (bool: boolean, contentWarningString: string) => {
    const response = await approvePost(
      props.post._id,
      bool,
      contentWarningString
    );
    if (response.success) {
      queryClient.setQueryData(
        ["moderatorPosts"],
        (data: InfiniteData<IPost[]> | undefined) => {
          const newData = data
            ? (JSON.parse(JSON.stringify(data)) as InfiniteData<IPost[]>)
            : undefined;
          newData?.pages.forEach(
            (_, index, array) =>
              (array[index] = array[index].filter(
                (post) => post._id !== props.post._id
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
    <div className={styles.Post}>
      <div className={styles.PostHeader}>
        <div className={styles.NumberAndWarning}>
          <PostNumber
            number={props.post.postNumber}
            _id={props.post.needsReview ? props.post._id : undefined}
            post={props.post}
          />
          {props.post.verifiedBrown && (
            <RiShieldCheckFill
              className={styles.VerifiedBrown}
              title="Verified Brown"
            />
          )}
          {props.post.contentWarning && (
            <ContentWarning ContentWarningText={props.post.contentWarning} />
          )}
          {props.post.pinned && (
            <AiFillPushpin className={styles.Pinned} title="Pinned Post" />
          )}
        </div>
        <div className={styles.PostHeaderRight}>
          <RelativeDate
            date={
              props.post.needsReview
                ? props.post.postTime
                : props.post.approvedTime
            }
          />
        </div>
      </div>
      <div className={styles.PostBody}>
        <UserContent blurred={false}>{props.post.content}</UserContent>
      </div>
      <ApproveOrDeny
        type="post"
        approve={(contentWarningString: string) =>
          void approveOrDeny(true, contentWarningString)
        }
        deny={(contentWarningString: string) => {
          void approveOrDeny(false, contentWarningString);
        }}
      />
    </div>
  );
}

export default ModeratorPost;
