import styles from "./CommentSection.module.scss";
import Thread from "./Thread";
import IComment from "types/IComment";
import NewCommentBox from "./new_comment/NewCommentBox";
import { useState } from "react";
import ViewMoreButton from "./ViewMoreButton";

export type CommentSectionProps = {
  postNumber: number;
  comments: IComment[];
  showTopLevelCommentBox: boolean;
  setShowTopLevelCommentBox: (show: boolean) => void;
  blurred: boolean;
  setBlurred: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface IThread extends IComment {
  children: IThread[];
  score: number;
}

const convertToThreads = (commentList: IComment[]) => {
  const threads: IThread[] = [];
  commentList.forEach((comment) => {
    const thread = comment as IThread;
    thread.children = [];
    threads.push(thread);
  });
  return threads;
};

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
      const parentClone = { ...parent, children: undefined };
      comment.parentComment = parentClone;
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
  const threads = nestComments(convertToThreads(props.comments));
  calculateScores(threads);
  sortComments(threads);
  const [comments, setComments] = useState<IThread[]>(threads);
  const firstThree = comments.slice(0, 3);
  const rest = comments.slice(3);
  const [showingAll, setShowingAll] = useState(false);

  return comments.length || props.showTopLevelCommentBox ? (
    <div className={styles.CommentSection}>
      {(showingAll ? comments : firstThree).map((comment, index) => (
        <Thread
          key={comment.commentNumber}
          comment={comment}
          depth={0}
          postNumber={props.postNumber}
          setComments={setComments}
          inContext={false}
          blurred={props.blurred}
          setBlurred={props.setBlurred}
          displayedChildren={2 - index}
        />
      ))}
      {!showingAll && rest.length > 0 && (
        <ViewMoreButton
          count={rest.length}
          type="comment"
          action={() => setShowingAll(true)}
        />
      )}
      {props.showTopLevelCommentBox && (
        <NewCommentBox
          firstComment={props.comments.length === 0}
          parentCommentNumber={-1}
          setShow={props.setShowTopLevelCommentBox}
          postNumber={props.postNumber}
          setComments={setComments}
        ></NewCommentBox>
      )}
    </div>
  ) : null;
}

export default CommentSection;
