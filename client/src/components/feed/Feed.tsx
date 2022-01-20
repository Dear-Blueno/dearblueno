import Post from "./post/Post";
import "./Feed.css";
import IPost from "../../types/IPost";
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  createContext,
  useMemo,
} from "react";
import {
  getModFeedPosts,
  getPosts,
  getPost,
  getModFeedComments,
} from "../../gateways/PostGateway";
import IUser from "../../types/IUser";
import IComment from "../../types/IComment";
import ModeratorSelection from "./post/moderator/ModeratorSelection";
import ContextThread from "./post/comments/ContextThread";

type FeedProps = {
  user?: IUser;
  moderatorView: boolean;
};

type FeedContextType = {
  user?: IUser;
  refreshPosts: () => void;
  refreshPost: (postId: number) => void;
};
export const FeedContext = createContext<FeedContextType>({
  refreshPosts: () => {},
  refreshPost: () => {},
});

function Feed(props: FeedProps) {
  const [feedElements, setFeedElements] = useState<HTMLDivElement[]>([]);
  const [feedList, setFeedList] = useState<(IPost | IComment)[]>([]);
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
  const [moderatorDisplayedComments, setModeratorDisplayedComments] = useState<
    IComment[]
  >([]);
  const [showModeratorPosts, setShowModeratorSelection] = useState(true);

  const getMoreFeedElements = useCallback(async () => {
    let gateway;
    if (props.moderatorView) {
      if (showModeratorPosts) {
        gateway = getModFeedPosts;
      } else {
        gateway = getModFeedComments;
      }
    } else {
      gateway = getPosts;
    }
    const response = await gateway(pageNumber);
    if (response.success && response.payload) {
      return response.payload;
    } else {
      console.log("error getting posts", response.message);
      return [];
    }
  }, [props.moderatorView, pageNumber, showModeratorPosts]);

  useEffect(() => {
    const loadMore = async () => {
      const newPosts = await getMoreFeedElements();
      if (newPosts.length > 0) {
        props.moderatorView
          ? setModeratorPosts((p) => [...p, ...newPosts])
          : setPosts((p) => [...p, ...newPosts]);
      }
      setLoading(false);
    };
    loadMore();
  }, [props.moderatorView, getMoreFeedElements]);

  // scroll action
  const onScroll = useCallback(() => {
    const postArray = props.moderatorView ? moderatorPosts : posts;
    if (displayedPostIndex === postArray.length - 1) {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setPageNumber((n) => n + 1);
        window.removeEventListener("scroll", onScroll);
      }
    } else {
      window.removeEventListener("scroll", onScroll);
    }
  }, [displayedPostIndex, posts, moderatorPosts, props.moderatorView]);

  // only update scroll listener if new posts have loaded
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
  }, [posts, moderatorPosts, onScroll]);

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
    setDisplayedPostIndex(newPosts.length);
  }, [props.moderatorView, pageNumber]);

  const refreshPost = useCallback(
    async (postNumber: number) => {
      const response = await getPost(postNumber);
      if (response.success && response.payload) {
        const post = response.payload;
        const postArray = props.moderatorView ? moderatorPosts : posts;
        const index = postArray.findIndex((p) => p._id === post._id);
        if (index !== -1) {
          const postSetter = props.moderatorView ? setModeratorPosts : setPosts;
          postSetter((p) => {
            p[index] = post;
            return [...p];
          });
        }
        props.moderatorView
          ? setModeratorDisplayedPosts(moderatorPosts)
          : setDisplayedPosts(posts);
      } else {
        console.log("error getting posts", response.message);
      }
    },

    [props.moderatorView, posts, moderatorPosts]
  );

  const initialContext: FeedContextType = {
    user: props.user,
    refreshPosts: refreshPosts,
    refreshPost: refreshPost,
  };

  return (
    <FeedContext.Provider value={initialContext}>
      <div className="Feed">
        {props.moderatorView ? (
          <>
            <ModeratorSelection
              selection={showModeratorPosts}
              toggle={() =>
                setShowModeratorSelection((selection) => !selection)
              }
            />
            {!loading &&
              (showModeratorPosts
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
                : moderatorDisplayedComments.map((comment) => (
                    <ContextThread thread={comment} />
                  )))}
          </>
        ) : (
          !loading &&
          displayedPosts.map((post) => (
            <Post
              user={props.user}
              key={post.postNumber}
              _id={post._id}
              postNumber={post.postNumber}
              postBody={post.content}
              postDate={new Date(post.approvedTime)}
              comments={post.comments}
              reactions={post.reactions}
              needsReview={post.needsReview}
            />
          ))
        )}
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
