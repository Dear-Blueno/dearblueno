import styles from "./Feed.module.scss";
import React, { useEffect, useCallback, useRef, useMemo } from "react";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import IPost from "types/IPost";

interface FeedProps {
  children: React.ReactNode | React.ReactNode[];
  getMore: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<IPost[]>>;
  animated: boolean;
  status: "idle" | "loading" | "error" | "success";
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean | undefined;
}

function Feed(props: FeedProps) {
  const {
    children,
    getMore,
    animated,
    status,
    hasNextPage,
    isFetchingNextPage,
  } = props;
  const reachedEnd = hasNextPage !== undefined && !hasNextPage;
  const loadingRef = useRef<HTMLDivElement>(null);

  // scroll action
  const onScroll = useCallback(() => {
    if (
      (loadingRef.current?.getBoundingClientRect().top ?? Infinity) <=
      window.innerHeight + 800
    ) {
      window.removeEventListener("scroll", onScroll);
      getMore()
        .then((response) => {
          if (response.hasNextPage) {
            window.addEventListener("scroll", onScroll);
          }
        })
        .catch((error) => {
          console.error(error);
          window.addEventListener("scroll", onScroll);
        });
    }
  }, [getMore]);

  useEffect(() => {
    if (!reachedEnd) {
      window.addEventListener("scroll", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }
  }, [onScroll, reachedEnd]);

  const loadingDiv = useMemo(
    () => (
      <div
        className={`${styles.FeedLoading} ${
          reachedEnd ? styles.FeedFinished : ""
        }`}
        ref={loadingRef}
        style={{
          opacity:
            status === "loading" || isFetchingNextPage || reachedEnd ? 1 : 0,
        }}
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
    ),
    [status, isFetchingNextPage, reachedEnd]
  );

  return (
    <div className={styles.Feed}>
      <>
        {children}
        {animated && loadingDiv}
      </>
    </div>
  );
}

export default Feed;
