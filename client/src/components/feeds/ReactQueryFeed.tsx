import styles from "./Feed.module.scss";
import React, { useState, useEffect, useCallback, useRef } from "react";
import IUser from "../../types/IUser";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "react-query";
import { IResponse } from "gateways/GatewayResponses";
import IPost from "types/IPost";

type FeedProps = {
  user?: IUser;
  children: React.ReactNode | React.ReactNode[];
  getMore: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<IResponse<IPost[]>, unknown>>;
  animated: boolean;
  status: "idle" | "loading" | "error" | "success";
  hasNextPage: boolean | undefined;
  isFetching: boolean | undefined;
};

function Feed(props: FeedProps) {
  const [pageNumber, setPageNumber] = useState(1);
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
      const response = await props.getMore();
      if (response) {
        window.addEventListener("scroll", onScroll);
      } else {
        setReachedEnd(true);
      }
    };
    loadMore();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pageNumber, onScroll, props.getMore]);

  const loadingDiv = () => (
    <div
      className={styles.FeedLoading}
      ref={loadingRef}
      style={{
        opacity: !(props.status === "loading" || props.isFetching || reachedEnd)
          ? 0
          : 1,
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
  );

  return (
    <div className={styles.Feed}>
      <>
        {props.children}
        {props.animated && loadingDiv()}
      </>
    </div>
  );
}

export default Feed;
