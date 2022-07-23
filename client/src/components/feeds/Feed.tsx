import styles from "./Feed.module.scss";
import React, { useState, useEffect, useCallback, useRef } from "react";
import IUser from "../../types/IUser";

interface FeedProps {
  user?: IUser;
  children: React.ReactNode[];
  getMore: (nextPageNumber: number) => Promise<boolean>;
  animated: boolean;
}

function Feed(props: FeedProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPageNumber(1);
  }, [props.getMore]);

  // scroll action
  const onScroll = useCallback(() => {
    if (
      (loadingRef.current?.getBoundingClientRect().top ?? Infinity) <=
      window.innerHeight + 500
    ) {
      setPageNumber((n) => n + 1);
      window.removeEventListener("scroll", onScroll);
    }
  }, []);

  useEffect(() => {
    const loadMore = async () => {
      setLoading(true);
      const response = await props.getMore(pageNumber);
      setLoading(false);
      if (response) {
        window.addEventListener("scroll", onScroll);
      } else {
        setReachedEnd(true);
      }
    };
    loadMore().catch((error) => console.error(error));
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, onScroll, props.getMore]);

  return (
    <div className={styles.Feed}>
      {props.children}
      {props.animated ? (
        <div
          className={styles.FeedLoading}
          ref={loadingRef}
          style={{ opacity: isLoading || reachedEnd ? 1 : 0 }}
        >
          {reachedEnd ? (
            "You’ve reached the end! Here be dragons."
          ) : (
            <>
              Loading more posts
              <span className={styles.FeedLoadingDot}>.</span>
              <span className={styles.FeedLoadingDot}>.</span>
              <span className={styles.FeedLoadingDot}>.</span>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Feed;
