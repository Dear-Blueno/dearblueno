import "./CommentSection.css";
import Thread from "./Thread";
import { useState } from "react";

export type CommentSectionProps = {
  postId: number;
  comments: Comment[];
};

export type Comment = {
  id: number;
  parentId: number;
  author: string;
  body: string;
  date: string;
  children: Comment[];
  reactions: string[][];
};

function CommentSection(props: CommentSectionProps) {
  const nestComments = (commentList: Comment[]) => {
    const commentMap: { [key: number]: Comment } = {};

    // move all the comments into a map of id => comment
    commentList.forEach((comment) => (commentMap[comment.id] = comment));

    // iterate over the comments again and correctly nest the children
    commentList.forEach((comment) => {
      if (comment.parentId !== -1) {
        const parent = commentMap[comment.parentId];
        if (!parent.children.includes(comment)) {
          parent.children.push(comment);
        }
        // (parent.children = parent.children || []).push(comment);
      }
    });

    // filter the list to return a list of correctly nested comments
    return commentList.filter((comment) => {
      return comment.parentId === -1;
    });
  };

  const comments = nestComments(props.comments);
  return (
    <div className="CommentSection">
      {comments.map((comment) => (
        <Thread comment={comment} />
      ))}
    </div>
  );
}

export default CommentSection;
