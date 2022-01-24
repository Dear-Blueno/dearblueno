import "./CommentSection.css";
import Thread from "./Thread";
import IComment from "../../../../types/IComment";
import NewCommentBox from "./new_comment/NewCommentBox";
import IUser from "../../../../types/IUser";
import { useState, useEffect } from "react";

export type CommentSectionProps = {
  user?: IUser;
  postNumber: number;
  comments: IThread[];
  showCommentBox: boolean;
  setShowCommentBox: (show: boolean) => void;
};

export interface IThread extends IComment {
  children: IThread[];
  score: number;
}

const nestComments = (commentList: IThread[]) => {
  const commentMap: { [key: number]: IThread } = {};

  // move all the comments into a map of id => comment
  commentList.forEach(
    (comment) => (commentMap[comment.commentNumber] = comment)
  );

  // iterate over the comments again and correctly nest the children
  commentList.forEach((comment) => {
    if (comment.parentCommentNumber !== -1) {
      const parent = commentMap[comment.parentCommentNumber];
      parent.children = parent.children || [];
      parent.children.push(comment);
    }
  });

  // filter the list to return a list of correctly nested comments
  return commentList.filter((comment) => {
    return comment.parentCommentNumber === -1;
  });
};

// simple algorithm to calculate the score of a comment
// a comment's score consists of:
// - the number of reactions for the comment and all its children
// - the number of children the comment has (including children of children)
const calculateScore = (comment: IThread) => {
  let reactionCount = 0;
  for (const reaction of comment.reactions) {
    if (reaction) {
      reactionCount += reaction.length;
    }
  }
  let childrenScoreSum = 0;
  for (const child of comment.children) {
    calculateScore(child);
    childrenScoreSum += child.score;
  }
  comment.score = reactionCount + comment.children.length + childrenScoreSum;
};

const calculateScores = (commentList: IThread[]) => {
  commentList.forEach((comment) => {
    calculateScore(comment);
  });
};

const sortComment = (comment: IThread) => {
  if (comment.children) {
    comment.children.sort((a, b) => {
      return b.score - a.score;
    });
    comment.children.forEach((child) => {
      sortComment(child);
    });
  }
};

const sortComments = (commentList: IThread[]) => {
  commentList.forEach((comment) => {
    sortComment(comment);
  });
  commentList.sort((a, b) => {
    return b.score - a.score;
  });
};

function CommentSection(props: CommentSectionProps) {
  const [comments, setComments] = useState<IThread[]>([]);
  useEffect(() => {
    const threads = nestComments(props.comments);
    calculateScores(threads);
    sortComments(threads);
    setComments(threads);
  }, [props.comments]);
  return props.comments.length || props.showCommentBox ? (
    <div className="CommentSection">
      {comments.map((comment, index) => (
        <Thread
          user={props.user}
          key={comment.commentNumber}
          comment={comment}
          collapsed={false}
          depth={0}
          postNumber={props.postNumber}
        />
      ))}
      {props.showCommentBox && (
        <NewCommentBox
          user={props.user}
          firstComment={props.comments.length === 0}
          parentCommentNumber={-1}
          setShow={props.setShowCommentBox}
          postNumber={props.postNumber}
        ></NewCommentBox>
      )}
    </div>
  ) : null;
}

export default CommentSection;
