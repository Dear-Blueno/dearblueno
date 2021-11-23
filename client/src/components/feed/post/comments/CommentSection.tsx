import "./CommentSection.css";
import Thread from "./Thread";
import IComment from "../../../../types/IComment";
import NewCommentBox from "./NewCommentBox";
import { useState } from "react";

export type CommentSectionProps = {
  postNumber: number;
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
  // const [comments, setComments] = useState<IThread[]>(props.comments);
  const [commentAreaActive, setCommentAreaActive] = useState<boolean>(false);

  return (
    <div className="CommentSection">
      {nestComments(props.comments).map((comment) => (
        <Thread key={comment.commentNumber} comment={comment} />
      ))}
      <NewCommentBox
        parentCommentNumber={-1}
        active={commentAreaActive}
        setActive={setCommentAreaActive}
        show={true}
      ></NewCommentBox>
    </div>
  );
}

export default CommentSection;
