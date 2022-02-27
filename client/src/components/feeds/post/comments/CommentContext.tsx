import "./CommentContext.css";
import UserContent from "components/feeds/UserContent";
import CommentProfilePicture from "components/user/CommentProfilePicture";
import IComment from "types/IComment";

type CommentContextProps = {
  thread: IComment;
  showProfilePicture?: boolean;
};

export default function CommentContext(props: CommentContextProps) {
  const isReply = props.thread.parentComment !== undefined;

  return (
    <div className="CommentContext">
      <div className="CommentContextConnectorContainer">
        <div className="CommentContextConnector"></div>
      </div>
      {isReply && (
        <>
          {props.showProfilePicture && (
            <div className="CommentContextParentPicture">
              <CommentProfilePicture
                link={
                  props.thread.parentComment.author
                    ? props.thread.parentComment.author.profilePicture
                    : undefined
                }
              />
            </div>
          )}
          <div className="CommentContextReplyAuthor">
            {props.thread.parentComment.author
              ? props.thread.parentComment.author.name
              : "Anonymous"}
          </div>
          <div className="CommentContextReplyText">
            <UserContent showContent={true}>
              {props.thread.parentComment.content.substring(0, 10)}
              {props.thread.parentComment.content.length > 10 ? "…" : ""}
            </UserContent>
          </div>
        </>
      )}
      {!isReply && (
        <>
          <div className="CommentContextPostNumber">
            #{props.thread.postNumber}
          </div>
          <div className="CommentContextPostContent">
            {(props.thread.post.content as string).substring(0, 70)}
            {(props.thread.post.content as string).length > 70 ? "…" : ""}
          </div>
        </>
      )}
    </div>
  );
}
