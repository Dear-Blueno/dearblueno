import styles from "./Post.module.scss";
import ContentWarning from "./ContentWarning";
import RelativeDate from "./RelativeDate";
import PostNumber from "./content/PostNumber";
import ApproveOrDeny from "./moderator/ApproveOrDeny";
import IPost from "types/IPost";
import { RiShieldCheckFill } from "react-icons/ri";
import UserContent from "./content/UserContent";
import { AiFillPushpin } from "react-icons/ai";

export interface ModeratorPostProps {
  post: IPost;
}

function ModeratorPost(props: ModeratorPostProps) {
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
        {props.post.imageUrl && (
          <div className={styles.PostImageContainer}>
            <img
              className={styles.PostImage}
              src={props.post.imageUrl}
              alt="Post Image"
            />
          </div>
        )}
      </div>
      <ApproveOrDeny type="post" postId={props.post._id} />
    </div>
  );
}

export default ModeratorPost;
