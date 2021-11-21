import "./CommentSection.css";
import Thread from "./Thread";
import { useState } from "react";
import IComment from "../../../../types/IComment";

export type CommentSectionProps = {
  postId: number;
  comments: IThread[];
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
      if (!parent.children.includes(comment)) {
        parent.children.push(comment);
      }
      // (parent.children = parent.children || []).push(comment);
    }
  });

  // filter the list to return a list of correctly nested comments
  return commentList.filter((comment) => {
    return comment.parentCommentNumber === -1;
  });
};

function CommentSection(props: CommentSectionProps) {
  const [comments /*, setComments*/] = useState<IThread[]>(
    nestComments(props.comments)
  );

  return (
    <div className="CommentSection">
      {comments.map((comment) => (
        <Thread key={comment.commentNumber} comment={comment} />
      ))}
    </div>
  );
}

export default CommentSection;
