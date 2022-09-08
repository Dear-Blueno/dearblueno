import EventCard from "components/event/EventCard";
import Masonry from "react-masonry-css";
import styles from "./EventsFeed.module.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getEvents } from "gateways/EventGateway";
import { useCallback, useEffect, useMemo, useRef } from "react";

export default function EventsFeed() {
  const fetchEvents = ({ pageParam = 1 }) =>
    getEvents(pageParam).then((res) => res.payload ?? []);

  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery(["events"], fetchEvents, {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return pages.length + 1;
      },
    });

  const reachedEnd = hasNextPage !== undefined && !hasNextPage;
  const loadingRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    if (
      (loadingRef.current?.getBoundingClientRect().top ?? Infinity) <=
      window.innerHeight + 500
    ) {
      window.removeEventListener("scroll", onScroll);
      fetchNextPage()
        .then((response) => {
          if (response.hasNextPage) {
            window.addEventListener("scroll", onScroll);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [fetchNextPage]);

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
          opacity: status === "loading" || isFetching || reachedEnd ? 1 : 0,
        }}
      >
        {reachedEnd ? (
          "No more events just yet!"
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
    [status, isFetching, reachedEnd]
  );

  const breakpointColumnsObj = {
    default: 2,
    700: 1,
  };

  return (
    <>
      {data && data.pages[0].length > 0 ? (
        <>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.myMasonryGrid}
            columnClassName={styles.myMasonryGridColumn}
          >
            {data.pages.map((page) =>
              page.map((event) => <EventCard key={event._id} event={event} />)
            )}
          </Masonry>
          {loadingDiv}
        </>
      ) : (
        <div className={styles.NoEvents}>No events have been posted yet!</div>
      )}
    </>
  );
}
