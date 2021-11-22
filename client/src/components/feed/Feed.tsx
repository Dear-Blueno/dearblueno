import Post from "./post/Post";
import "./Feed.css";
import IComment from "../../types/IComment";
import { IThread } from "./post/comments/CommentSection";
import IPost from "../../types/IPost";
import { useState, useEffect } from "react";
import {
  approvePost,
  commentOnPost,
  createPost,
  getPosts,
} from "../../gateways/PostGateway";

function Feed() {
  const [pageNumber] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    getPosts(pageNumber).then((response) => {
      if (response.success && response.payload) {
        setPosts((p) => (response.payload ? [...p, ...response.payload] : p));
      } else {
        console.log("error getting posts", response.message);
      }
    });
  }, [pageNumber]);

  const convertToThread = (comment: IComment) => {
    const thread = comment as IThread;
    thread.children = [];
    return thread;
  };

  const convertCommentsToThreads = (comments: IComment[]) => {
    return comments.map(convertToThread);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const content =
    "What is going on with Spring Weekend this year? Is it gonna be back in person again?";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addPost = (content: string) => {
    createPost(content).then((response) => {
      if (response.success && response.payload) {
        approvePost(response.payload._id, true);
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const postNumber = 6;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const commentContent =
    "Flex 330 for life. Real talk though I have met very few people who were close to running out even on Flex 330. Even if you end up having to buy meals your last week or 2 on Thayer it will end up being cheaper than either 20 Weekly or Flex 460.";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const parentCommentNumber = -1;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addComment = (
    postNumber: number,
    content: string,
    parentCommentNumber: number
  ) => {
    console.log("add comment", postNumber, content, parentCommentNumber);
    commentOnPost(postNumber, content, parentCommentNumber).then((response) => {
      if (response.success && response.payload) {
      } else {
        console.log("error commenting on post", response.message);
      }
    });
  };

  return (
    <div className="Feed">
      {posts.map((post) => {
        return (
          <Post
            key={post.postNumber}
            postNumber={post.postNumber}
            postBody={post.content}
            postDate={new Date(post.postTime).toLocaleDateString()}
            comments={convertCommentsToThreads(post.comments)}
            reactions={post.reactions}
          />
        );
      })}
      {/* Button which adds a new post  */}
      {/* <button onClick={() => addPost(content)}>Add Post</button> */}
      {/* Button which adds a new comment  */}
      {/* <button
        onClick={() =>
          addComment(postNumber, commentContent, parentCommentNumber)
        }
      >
        Add Comment
      </button> */}
    </div>
  );
}

export default Feed;
