import styles from "./Post.module.scss";
import ContentWarning from "./ContentWarning";
import RelativeDate from "./RelativeDate";
import PostNumber from "./content/PostNumber";
import ReactionBar from "./reactions/ReactionBar";
import DividerDot from "./content/DividerDot";
import { FiShare } from "react-icons/fi";
import CommentSection from "./comments/CommentSection";
import { useEffect, useState } from "react";
import { bookmarkPost, subscribeToPost } from "gateways/PostGateway";
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
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export interface PostProps {
  post: IPost;
  bookmarked?: boolean;
  subscribed?: boolean;
}

function Post(props: PostProps) {
  const queryClient = useQueryClient();
  const { user, refetchUser } = useUser();
  const { userOnlyAction } = useLoginPopup();
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [blurred, setBlurred] = useState(
    props.post.contentWarning ? props.post.contentWarning.length > 0 : false
  );
  const [isBookmarked, setIsBookmarked] = useState(props.bookmarked);
  const [isSubscribed, setIsSubscribed] = useState(props.subscribed);

  useEffect(() => {
    setIsBookmarked(user?.bookmarks.includes(props.post._id));
    setIsSubscribed(user?.subscriptions.includes(props.post._id));
  }, [user, props.post._id]);

  const handleSubscribe = async () => {
    const initialIsSubscribed = isSubscribed;
    setIsSubscribed((subscribed) => !subscribed);
    const response = await subscribeToPost(
      props.post.postNumber,
      !initialIsSubscribed
    );
    if (response.success) {
      const action = initialIsSubscribed
        ? "Unsubscribed from"
        : "Subscribed to";
      toast.success(`${action} #${props.post.postNumber}`);
      await refetchUser();
    } else {
      toast.error((response.message as unknown as { message: string }).message);
      setIsSubscribed(!isSubscribed);
    }
  };

  const handleBookmark = async () => {
    const initialIsBookmarked = isBookmarked;
    setIsBookmarked((bookmarked) => !bookmarked);
    const response = await bookmarkPost(
      props.post.postNumber,
      !initialIsBookmarked
    );
    if (response.success) {
      const action = initialIsBookmarked ? "Unbookmarked" : "Bookmarked";
      toast.success(`${action} #${props.post.postNumber}`);
      void queryClient.refetchQueries(["bookmarks"]);
      await refetchUser();
    } else {
      toast.error((response.message as unknown as { message: string }).message);
      setIsBookmarked(initialIsBookmarked);
    }
  };

  return (
    <div className={styles.Post}>
      <div className={styles.PostHeader}>
        <div className={styles.NumberAndWarning}>
          <PostNumber number={props.post.postNumber} post={props.post} />
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
              onClick={userOnlyAction(() => void handleSubscribe())}
            />
          ) : (
            <MdNotificationsNone
              size="1.2em"
              color="#789"
              className={styles.IconButton}
              title="Click to subscribe"
              onClick={userOnlyAction(() => void handleSubscribe())}
            />
          )}
          {isBookmarked ? (
            <MdBookmark
              size="1.2em"
              fill="#4caf50"
              className={styles.IconButton}
              title="Click to remove bookmark"
              onClick={userOnlyAction(() => void handleBookmark())}
            />
          ) : (
            <MdBookmarkBorder
              size="1.2em"
              color="#789"
              className={styles.IconButton}
              title="Click to bookmark"
              onClick={userOnlyAction(() => void handleBookmark())}
            />
          )}
          <RelativeDate date={props.post.approvedTime} />
        </div>
      </div>
      <div className={styles.PostBody}>
        <UserContent blurred={blurred} setBlurred={setBlurred}>
          {props.post.content}
        </UserContent>
      </div>

      <div className={styles.PostFooter}>
        <ReactionBar
          postNumber={props.post.postNumber}
          commentNumber={undefined}
          type="post"
          reactions={props.post.reactions}
        />
        <DividerDot />
        <FaRegCommentAlt
          className={styles.IconButton}
          color="#789"
          onClick={userOnlyAction(() => setShowCommentBox(true))}
          style={{ transform: "translateY(0.05em)" }}
          title="Add a comment"
        />
        <DividerDot />
        <FiShare
          className={styles.IconButton}
          style={{ transform: "translateY(-0.05em)" }}
          color="#789"
          onClick={() => {
            void navigator.clipboard.writeText(
              `${window.location.origin}/post/${props.post.postNumber}`
            );
            toast("Link copied to clipboard!", { icon: "📋" });
          }}
          title="Share this post"
        />
      </div>
      <CommentSection
        comments={props.post.comments}
        blurred={blurred}
        setBlurred={setBlurred}
        postNumber={props.post.postNumber}
        showTopLevelCommentBox={showCommentBox}
        setShowTopLevelCommentBox={setShowCommentBox}
      />
    </div>
  );
}

export default Post;
