import "./CommentSection.css";
import Thread from "./Thread";
import IComment from "../../../../types/IComment";
import NewCommentBox from "./NewCommentBox";
import IUser from "../../../../types/IUser";
import { useState, useEffect } from "react";

export type CommentSectionProps = {
  user: IUser | undefined;
  postNumber: number;
  comments: IThread[];
  showCommentBox: boolean;
};

export interface IThread extends IComment {
  children: IThread[];
}

const nestComments = (commentList: IThread[]): IThread[] => {
  const commentMap: { [key: number]: IThread } = {};

  // move all the comments into a map of id => comment
  commentList.forEach(
    (comment) => (commentMap[comment.commentNumber] = comment)
  );

  // iterate over the comments again and correctly nest the children
  commentList.forEach((comment) => {
    if (comment.parentCommentNumber !== -1) {
      const parent = commentMap[comment.parentCommentNumber];
      (parent.children = parent.children || []).push(comment);
    }
  });

  // filter the list to return a list of correctly nested comments
  return commentList.filter((comment) => {
    return comment.parentCommentNumber === -1;
  });
};

function CommentSection(props: CommentSectionProps) {
  const [comments, setComments] = useState<IThread[]>([]);
  useEffect(() => {
    setComments(nestComments(props.comments));
  }, [props.comments]);
  return props.comments.length || props.showCommentBox ? (
    <div className="CommentSection">
      {comments.map((comment, index) => (
        <Thread
          user={props.user}
          key={comment.commentNumber}
          comment={comment}
          collapsed={false}
          firstThread={index === 0}
        />
      ))}
      <NewCommentBox
        user={props.user}
        firstComment={props.comments.length === 0}
        parentCommentNumber={-1}
        show={props.showCommentBox}
      ></NewCommentBox>
    </div>
  ) : null;
}

export default CommentSection;
