import styles from "./Feed.module.scss";
import React, { useEffect, useCallback, useRef, useMemo } from "react";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "react-query";
import { IResponse } from "gateways/GatewayResponses";
import IPost from "types/IPost";

interface FeedProps {
  children: React.ReactNode | React.ReactNode[];
  getMore: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<IResponse<IPost[]>>>;
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
  const onScroll = useCallback(async () => {
    if (
      (loadingRef.current?.getBoundingClientRect().top ?? Infinity) <=
      window.innerHeight + 500
    ) {
      window.removeEventListener("scroll", onScroll);
      const response = await getMore();
      if (response.hasNextPage) {
        window.addEventListener("scroll", onScroll);
      }
    }
  }, [getMore]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
  }, [onScroll]);

  const loadingDiv = useMemo(
    () => (
      <div
        className={
          reachedEnd
            ? styles.FeedLoading + " " + styles.FeedFinished
            : styles.FeedLoading
        }
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
