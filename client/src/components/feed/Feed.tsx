import Post from "./post/Post";
import "./Feed.css";
import IPost from "../../types/IPost";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  createContext,
} from "react";
import { getModFeedPosts, getPosts } from "../../gateways/PostGateway";
import IUser from "../../types/IUser";
import IComment from "../../types/IComment";

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
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<IPost[]>([]);
  const [moderatorPosts, setModeratorPosts] = useState<IPost[]>([]);
  const [moderatorDisplayedPosts, setModeratorDisplayedPosts] = useState<
    IPost[]
  >([]);
  const [displayedPostIndex, setDisplayedPostIndex] = useState(0);
  const [moderatorComments, setModeratorComments] = useState<IComment[]>([]);

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
    const loadMore = async () => {
      const newPosts = await getMorePosts();
      props.moderatorView
        ? setModeratorPosts((p) => [...p, ...newPosts])
        : setPosts((p) => [...p, ...newPosts]);
      setLoading(false);
    };
    loadMore();
  }, [props.moderatorView, getMorePosts]);

  // scroll action
  const onScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPageNumber(pageNumber + 1);
      window.removeEventListener("scroll", onScroll);
    }
  }, [pageNumber]);

  // only update scroll listener if new posts have loaded
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, moderatorPosts]);

  // move posts from posts array to displayedPosts array
  const updateDisplayedPosts = useCallback(() => {
    const postArray = props.moderatorView ? moderatorPosts : posts;
    if (!loading && postArray.length > 0) {
      const postSetter = props.moderatorView
        ? setModeratorDisplayedPosts
        : setDisplayedPosts;
      postSetter((p) => [...p, postArray[displayedPostIndex]]);
      setDisplayedPostIndex((i) => i + 1);
    }
  }, [props.moderatorView, loading, posts, moderatorPosts, displayedPostIndex]);

  // update displayed posts on an interval to create post appear animation
  useInterval(
    updateDisplayedPosts,
    displayedPostIndex === (props.moderatorView ? moderatorPosts : posts).length
      ? null
      : 80
  );

  // side effects for view change
  useEffect(() => {
    setPageNumber(1);
    setDisplayedPostIndex(0);
    props.moderatorView ? setPosts([]) : setModeratorPosts([]);
    props.moderatorView
      ? setDisplayedPosts([])
      : setModeratorDisplayedPosts([]);
  }, [props.moderatorView]);

  const refreshPosts = useCallback(async () => {
    const gateway = props.moderatorView ? getModFeedPosts : getPosts;
    let newPosts: IPost[] = [];
    for (let i = 0; i < pageNumber; i++) {
      const response = await gateway(i + 1);
      if (response.success && response.payload) {
        const responsePosts = response.payload;
        newPosts = [...newPosts, ...responsePosts];
      } else {
        console.log("error getting posts", response.message);
      }
    }
    props.moderatorView ? setModeratorPosts(newPosts) : setPosts(newPosts);
    props.moderatorView
      ? setModeratorDisplayedPosts(newPosts)
      : setDisplayedPosts(newPosts);
  }, [props.moderatorView, pageNumber]);

  const initialContext: FeedContextType = {
    user: props.user,
    refreshPosts: refreshPosts,
  };

  return (
    <FeedContext.Provider value={initialContext}>
      <div className="Feed">
        {!loading &&
          (props.moderatorView
            ? moderatorDisplayedPosts.map((post) => (
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
            : displayedPosts.map((post) => (
                <Post
                  user={props.user}
                  key={post.postNumber}
                  _id={post._id}
                  postNumber={post.postNumber}
                  postBody={post.content}
                  postDate={new Date(post.postTime)}
                  comments={post.comments}
                  reactions={post.reactions}
                  needsReview={post.needsReview}
                />
              )))}
      </div>
    </FeedContext.Provider>
  );
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default Feed;
