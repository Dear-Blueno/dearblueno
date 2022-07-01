import styles from "./Post.module.scss";
import ContentWarning from "./ContentWarning";
import RelativeDate from "./RelativeDate";
import PostNumber from "./content/PostNumber";
import ReactionBar from "./reactions/ReactionBar";
import DividerDot from "./content/DividerDot";
import { FiShare } from "react-icons/fi";
import CommentSection from "./comments/CommentSection";
import { useState } from "react";
import ApproveOrDeny from "./moderator/ApproveOrDeny";
import {
  approvePost,
  bookmarkPost,
  subscribeToPost,
} from "gateways/PostGateway";
import ShareButton from "./ShareButton";
import IPost from "types/IPost";
import { RiShieldCheckFill } from "react-icons/ri";
import {
  MdBookmarkBorder,
  MdBookmark,
  MdNotificationsNone,
  MdNotificationsActive,
} from "react-icons/md";
import UserContent from "./content/UserContent";
import { AiFillPushpin } from "react-icons/ai";
import useUser from "hooks/useUser";
import { useLoginPopup } from "hooks/login-popup";
import { FaRegCommentAlt } from "react-icons/fa";

export type PostProps = {
  post: IPost;
  delay?: string;
  skipAnimation?: boolean;
  setFeed?: React.Dispatch<React.SetStateAction<IPost[]>>;
};

function Post(props: PostProps) {
  const { user, refetchUser } = useUser();
  const setLoginPopupIsOpen = useLoginPopup();
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [blurred, setBlurred] = useState(props.post.contentWarning.length > 0);
  const [isBookmarked, setIsBookmarked] = useState(
    user?.bookmarks.includes(props.post._id)
  );
  const [isSubscribed, setIsSubscribed] = useState(
    user?.subscriptions.includes(props.post._id)
  );

  const approveOrDeny = async (bool: boolean, contentWarningString: string) => {
    const response = await approvePost(
      props.post._id,
      bool,
      contentWarningString
    );
    if (response.success && props.setFeed) {
      props.setFeed((posts) => posts.filter((p) => p._id !== props.post._id));
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribed((subscribed) => !subscribed);
    const response = await subscribeToPost(
      props.post.postNumber,
      !isSubscribed
    );
    if (response.success) {
      refetchUser();
    } else {
      setIsSubscribed(!isSubscribed);
    }
  };

  const handleBookmark = async () => {
    setIsBookmarked((bookmarked) => !bookmarked);
    const response = await bookmarkPost(props.post.postNumber, !isBookmarked);
    if (response.success) {
      refetchUser();
    } else {
      setIsBookmarked((bookmarked) => !bookmarked);
    }
  };

  return (
    <div
      className={styles.DearBluenoCard}
      style={{
        animationDelay: props.delay ?? "0",
        // animation: props.skipAnimation ? "none" : undefined,
        opacity: props.skipAnimation ? 1 : undefined,
      }}
    >
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
          {isSubscribed ? (
            <MdNotificationsActive
              size="1.2em"
              fill="#1976d2"
              className={styles.IconButton}
              title="Click to unsubscribe"
              onClick={handleSubscribe}
            />
          ) : (
            <MdNotificationsNone
              size="1.2em"
              color="#789"
              className={styles.IconButton}
              title="Click to subscribe"
              onClick={handleSubscribe}
            />
          )}
          {isBookmarked ? (
            <MdBookmark
              size="1.2em"
              fill="#4caf50"
              className={styles.IconButton}
              title="Click to remove bookmark"
              onClick={handleBookmark}
            />
          ) : (
            <MdBookmarkBorder
              size="1.2em"
              color="#789"
              className={styles.IconButton}
              title="Click to bookmark"
              onClick={handleBookmark}
            />
          )}
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
        <UserContent blurred={blurred} setBlurred={setBlurred}>
          {props.post.content}
        </UserContent>
      </div>
      {props.post.needsReview ? (
        <ApproveOrDeny
          type="post"
          approve={(contentWarningString: string) =>
            approveOrDeny(true, contentWarningString)
          }
          deny={(contentWarningString: string) => {
            approveOrDeny(false, contentWarningString);
          }}
        />
      ) : (
        <div className={styles.PostFooter}>
          <ReactionBar
            postNumber={props.post.postNumber ?? 0}
            commentNumber={undefined}
            type="post"
            reactions={props.post.reactions}
          />
          <DividerDot />
          <FaRegCommentAlt
            className={styles.IconButton}
            color="#789"
            onClick={
              user
                ? () => setShowCommentBox(true)
                : () => setLoginPopupIsOpen(true)
            }
            style={{ transform: "translateY(0.05em)" }}
          />
          <DividerDot />
          <FiShare
            className={styles.IconButton}
            style={{ transform: "translateY(-0.05em)" }}
            color="#789"
            onClick={() =>
              navigator.clipboard.writeText(
                `${window.location.origin}/post/${props.post.postNumber}`
              )
            }
          />
        </div>
      )}
      {!props.post.needsReview && (
        <CommentSection
          comments={props.post.comments}
          blurred={blurred}
          setBlurred={setBlurred}
          postNumber={props.post.postNumber ?? 0}
          showTopLevelCommentBox={showCommentBox}
          setShowTopLevelCommentBox={setShowCommentBox}
        />
      )}
    </div>
  );
}

export default Post;
