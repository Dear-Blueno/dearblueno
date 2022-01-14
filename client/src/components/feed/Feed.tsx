import Post from "./post/Post";
import "./Feed.css";
import IPost from "../../types/IPost";
import { useState, useEffect, useCallback, createContext } from "react";
import { getModFeedPosts, getPosts } from "../../gateways/PostGateway";
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
  const [moderatorPosts, setModeratorPosts] = useState<IPost[]>([]);

  const onScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPageNumber(pageNumber + 1);
      window.removeEventListener("scroll", onScroll);
    }
  }, [pageNumber]);

  const getMorePosts = useCallback(async () => {
    const gateway = props.moderatorView ? getModFeedPosts : getPosts;
    const response = await gateway(pageNumber);
    if (response.success && response.payload) {
      return response.payload;
    } else {
      console.log("error getting posts", response.message);
      return [];
    }
  }, [props.moderatorView, pageNumber]);

  useEffect(() => {
    setPageNumber(1);
    props.moderatorView ? setPosts([]) : setModeratorPosts([]);
  }, [props.moderatorView]);

  useEffect(() => {
    const loadMore = async () => {
      const newPosts = await getMorePosts();
      props.moderatorView
        ? setModeratorPosts((p) => [...p, ...newPosts])
        : setPosts((p) => [...p, ...newPosts]);
    };
    loadMore();
  }, [props.moderatorView, getMorePosts]);

  // only update scroll listener if new posts have loaded
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

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
          ? moderatorPosts.map((post) => (
              <Post
                user={props.user}
                key={post._id}
                _id={post._id}
                postNumber={undefined}
                postBody={post.content}
                postDate={new Date(post.postTime)}
                comments={[]}
                reactions={[]}
                needsReview={post.needsReview}
              />
            ))
          : posts.map((post) => (
              <Post
                user={props.user}
                key={post.postNumber}
                _id={undefined}
                postNumber={post.postNumber}
                postBody={post.content}
                postDate={new Date(post.postTime)}
                comments={post.comments}
                reactions={post.reactions}
                needsReview={post.needsReview}
              />
            ))}
      </div>
    </FeedContext.Provider>
  );
}

export default Feed;
