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
import { AiFillPushpin, AiFillRobot } from "react-icons/ai";
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
        <div className={styles.PostHeaderLeft}>
          <PostNumber number={props.post.postNumber} post={props.post} />
          {props.post.verifiedBrown && (
            <RiShieldCheckFill
              className={styles.VerifiedBrown}
              title="Verified Brown"
            />
          )}
          {props.post.postNumber >= 6305 && (
            <AiFillRobot
              color="gray"
              className={styles.Bot}
              title="Made by BluenoGPT"
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
          <button
            className={styles.FooterButton}
            title={isSubscribed ? "Click to unsubscribe" : "Click to subscribe"}
            onClick={userOnlyAction(() => void handleSubscribe())}
          >
            {isSubscribed ? (
              <MdNotificationsActive size="1.6em" fill="#1976d2" />
            ) : (
              <MdNotificationsNone size="1.6em" color="#789" />
            )}
          </button>
          <button
            className={styles.FooterButton}
            title={
              isBookmarked ? "Click to remove bookmark" : "Click to bookmark"
            }
            onClick={userOnlyAction(() => void handleBookmark())}
          >
            {isBookmarked ? (
              <MdBookmark size="1.6em" fill="#4caf50" />
            ) : (
              <MdBookmarkBorder size="1.6em" color="#789" />
            )}
          </button>
          <RelativeDate date={props.post.approvedTime} />
        </div>
      </div>
      <div className={styles.PostBody} title={blurred ? "Click to reveal" : ""}>
        <UserContent blurred={blurred} setBlurred={setBlurred}>
          {props.post.content}
        </UserContent>
        {props.post.imageUrl && (
          <div
            className={styles.PostImageContainer}
            onClick={() => setBlurred(false)}
          >
            <img
              className={
                styles.PostImage + " " + (blurred ? styles.PostImageHidden : "")
              }
              src={props.post.imageUrl}
              alt="Post Image"
            />
            {blurred && <div className={styles.ImageCover} />}
            {blurred && (
              <div className={styles.ClickToRevealContainer}>
                Click to reveal
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.PostFooter}>
        <ReactionBar
          postNumber={props.post.postNumber}
          commentNumber={undefined}
          type="post"
          reactions={props.post.reactions}
        />
        <DividerDot />
        <button
          className={styles.FooterButton}
          title="Add a comment"
          onClick={userOnlyAction(() => setShowCommentBox(true))}
        >
          <FaRegCommentAlt
            color="#789"
            size="1.4em"
            style={{ transform: "translateY(0.05rem)" }}
          />
        </button>
        <DividerDot />
        <button
          className={styles.FooterButton}
          title="Share this post"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (navigator.share) {
              navigator
                .share({
                  title: `Post #${props.post.postNumber}`,
                  url: `https://dearblueno.net/post/${props.post.postNumber}`,
                })
                .catch((err) => {
                  console.error(err);
                });
            } else {
              navigator.clipboard
                .writeText(
                  `https://dearblueno.net/post/${props.post.postNumber}`
                )
                .catch((err) => {
                  console.error(err);
                });
              toast("Link copied to clipboard!", { icon: "📋" });
            }
          }}
        >
          <FiShare color="#789" size="1.4em" />
        </button>
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
