import Post from "./post/Post";
import "./Feed.css";
import IComment from "../../types/IComment";
import { IThread } from "./post/comments/CommentSection";
import IPost from "../../types/IPost";
import { useState, useEffect, useCallback, createContext } from "react";
import { getPosts } from "../../gateways/PostGateway";
import IUser from "../../types/IUser";

type FeedProps = {
  user?: IUser;
  moderatorView: boolean;
};

type FeedContextType = {
  user?: IUser;
  refreshPosts: () => void;
};
export const FeedContext = createContext<FeedContextType>({
  refreshPosts: () => {},
});

function Feed(props: FeedProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);

  const onScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPageNumber(pageNumber + 1);
      window.removeEventListener("scroll", onScroll);
    }
  }, [pageNumber]);

  useEffect(() => {
    getPosts(pageNumber).then((response) => {
      if (response.success && response.payload) {
        if (response.payload.length > 0) {
          setPosts((p) => (response.payload ? [...p, ...response.payload] : p));
        }
      } else {
        console.log("error getting posts", response.message);
      }
    });
  }, [pageNumber]);

  // only update scroll listener if new posts have loaded
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  const convertToThread = (comment: IComment) => {
    const thread = comment as IThread;
    thread.children = [];
    return thread;
  };

  const convertCommentsToThreads = (comments: IComment[]) => {
    return comments.map(convertToThread);
  };

  const refreshPosts = async () => {
    console.log("refreshing posts");
    let newPosts: IPost[] = [];
    for (let i = 0; i < pageNumber; i++) {
      const response = await getPosts(i + 1);
      if (response.success && response.payload) {
        const responsePosts = response.payload;
        newPosts = [...newPosts, ...responsePosts];
      } else {
        console.log("error getting posts", response.message);
      }
    }
    setPosts(newPosts);
  };

  const initialContext: FeedContextType = {
    user: props.user,
    refreshPosts: refreshPosts,
  };

  return (
    <FeedContext.Provider value={initialContext}>
      <div className="Feed">
        {props.moderatorView
          ? null
          : posts.map((post) => {
              return (
                <Post
                  user={props.user}
                  key={post.postNumber}
                  postNumber={post.postNumber}
                  postBody={post.content}
                  postDate={new Date(post.postTime)}
                  comments={convertCommentsToThreads(post.comments)}
                  reactions={post.reactions}
                />
              );
            })}
      </div>
    </FeedContext.Provider>
  );
}

export default Feed;
