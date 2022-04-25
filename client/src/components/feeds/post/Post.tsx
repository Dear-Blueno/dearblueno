import "./Post.css";
import ContentWarning from "./ContentWarning";
import RelativeDate from "./RelativeDate";
import PostNumber from "./content/PostNumber";
import ReactionBar from "./reactions/ReactionBar";
import DividerDot from "./content/DividerDot";
import CommentButton from "./comments/CommentButton";
import CommentSection, { IThread } from "./comments/CommentSection";
import { useState } from "react";
import IUser from "../../../types/IUser";
import IComment from "../../../types/IComment";
import ApproveOrDeny from "./moderator/ApproveOrDeny";
import { approvePost } from "../../../gateways/PostGateway";
import ShareButton from "./ShareButton";
import IPost from "../../../types/IPost";
import LoginPopup from "./LoginPopup";
import { RiShieldCheckFill } from "react-icons/ri";
import UserContent from "../UserContent";

export type PostProps = {
  user?: IUser;
  post: IPost;
  delay?: string;
  skipAnimation?: boolean;
  setFeed?: React.Dispatch<React.SetStateAction<IPost[]>>;
};

const convertToThread = (comment: IComment) => {
  const thread = comment as IThread;
  thread.children = [];
  return thread;
};

function Post(props: PostProps) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showPopup, setshowPopup] = useState(false);
  const openPopup = () => {
    setshowPopup(true);
  };

  const closePopup = () => setshowPopup(false);

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

  return (
    <div
      className="Post"
      style={{
        animationDelay: props.delay ?? "0",
        animation: props.skipAnimation ? "none" : undefined,
        opacity: props.skipAnimation ? 1 : undefined,
      }}
    >
      <LoginPopup showPopup={showPopup} closePopup={closePopup} />
      <div className="PostHeader">
        <div className="NumberAndWarning">
          <PostNumber
            number={props.post.postNumber}
            _id={props.post.needsReview ? props.post._id : undefined}
            post={props.post}
          />
          {props.post.verifiedBrown ? (
            <RiShieldCheckFill
              className="VerifiedBrown"
              title="Verified Brown"
            />
          ) : null}
          {props.post.contentWarning && (
            <ContentWarning ContentWarningText={props.post.contentWarning} />
          )}
        </div>
        <div className="PostDate">
          <RelativeDate
            date={
              props.post.needsReview
                ? props.post.postTime
                : props.post.approvedTime
            }
          />
        </div>
      </div>
      <div className="PostBody">
        <UserContent showContent={!props.post.contentWarning}>
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
        <div className="PostFooter">
          <ReactionBar
            postNumber={props.post.postNumber ?? 0}
            commentNumber={undefined}
            user={props.user}
            type={"post"}
            reactions={props.post.reactions}
          />
          <DividerDot />
          <CommentButton
            type="comment"
            click={props.user ? () => setShowCommentBox(true) : openPopup}
          />
          <DividerDot />
          <ShareButton postNumber={props.post.postNumber} />
        </div>
      )}
      {!props.post.needsReview && (
        <CommentSection
          user={props.user}
          comments={props.post.comments.map(convertToThread)}
          contentWarning={props.post.contentWarning}
          postNumber={props.post.postNumber ?? 0}
          showCommentBox={showCommentBox}
        />
      )}
    </div>
  );
}

export default Post;
