import "./CommentSection.css";
import Thread from "./Thread";

export interface CommentSectionProps {
  postId: number;
}

// export interface CommentData {
// id: number;
// parentId: number;
// author: string;
// body: string;
// date: string;
// }

export type Comment = {
  id: number;
  parentId: number;
  author: string;
  body: string;
  date: string;
  children: Comment[];
};

const commentMap: { [key: number]: Comment } = {};

function nestComments(commentList: Comment[]) {
  // move all the comments into a map of id => comment
  commentList.forEach((comment) => (commentMap[comment.id] = comment));

  // iterate over the comments again and correctly nest the children
  commentList.forEach((comment) => {
    if (comment.parentId !== -1) {
      const parent = commentMap[comment.parentId];
      (parent.children = parent.children || []).push(comment);
    }
  });

  // filter the list to return a list of correctly nested comments
  return commentList.filter((comment) => {
    return comment.parentId === -1;
  });
}

const comments: Comment[] = [];
const comment1: Comment = {
  id: 1,
  parentId: -1,
  author: "Dylan Hu",
  body: "This is a comment",
  date: "2020-01-01",
  children: [],
};
const comment2: Comment = {
  id: 2,
  parentId: 1,
  author: "Nicholas Vadasz",
  body: "This is another comment",
  date: "2020-01-01",
  children: [],
};
const comment3: Comment = {
  id: 3,
  parentId: 2,
  author: "Dylan Hu",
  body: "That's cool yo",
  date: "2020-01-01",
  children: [],
};

const comment5: Comment = {
  id: 5,
  parentId: 2,
  author: "Nick Bottone",
  body: "This is a comment",
  date: "2020-01-01",
  children: [],
};
const comment6: Comment = {
  id: 6,
  parentId: 1,
  author: "Nick Bottone",
  body: "SHEEEESH",
  date: "2020-01-01",
  children: [],
};
comments.push(comment1, comment2, comment3, comment5, comment6);
nestComments(comments);

function CommentSection(props: CommentSectionProps) {
  return (
    <div className="CommentSection">
      <Thread comment={commentMap[1]} />
    </div>
  );
}

export default CommentSection;
