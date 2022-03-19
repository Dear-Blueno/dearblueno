import "./Feed.css";
import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useRef,
} from "react";
import IUser from "../../types/IUser";

type FeedProps = {
  user?: IUser;
  children: React.ReactNode[];
  getMore: (nextPageNumber: number) => Promise<boolean>;
  animated: boolean;
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
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPageNumber(1);
  }, [props.getMore]);

  // scroll action
  const onScroll = useCallback(() => {
    if (
      (loadingRef.current?.getBoundingClientRect().top ?? Infinity) <=
      (feedRef.current?.clientHeight ?? 0) + 1000
    ) {
      setPageNumber((n) => n + 1);
      feedRef.current?.removeEventListener("scroll", onScroll);
    }
  }, []);

  useEffect(() => {
    const loadMore = async () => {
      setLoading(true);
      const response = await props.getMore(pageNumber);
      setLoading(false);
      if (response) {
        feedRef.current?.addEventListener("scroll", onScroll);
      } else {
        setReachedEnd(true);
      }
    };
    loadMore();
    const feedRefCurrent = feedRef.current;
    return () => {
      feedRefCurrent?.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, onScroll, props.getMore]);

  return (
    <div className="Feed" ref={feedRef}>
      {props.children}
      {props.animated ? (
        <div
          className="FeedLoading"
          ref={loadingRef}
          style={{ opacity: isLoading || reachedEnd ? 1 : 0 }}
        >
          {reachedEnd ? (
            "You’ve reached the end! Here be dragons."
          ) : (
            <>
              Loading more posts
              <span className="FeedLoadingDot">.</span>
              <span className="FeedLoadingDot">.</span>
              <span className="FeedLoadingDot">.</span>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Feed;
