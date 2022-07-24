import EventCard from "components/event/EventCard";
import Masonry from "react-masonry-css";
import styles from "./EventsFeed.module.scss";
import { useInfiniteQuery } from "react-query";
import { getEvents } from "gateways/EventGateway";
import { useCallback, useEffect, useMemo, useRef } from "react";

export default function EventsFeed() {
  const fetchEvents = ({ pageParam = 1 }) => getEvents(pageParam);

  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery("events", fetchEvents, {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.payload?.length === 0) {
          return undefined;
        }
        return pages.length + 1;
      },
    });

  const events = data?.pages
    .map((page) => page.payload)
    .flat()
    .reverse();

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
    [status, isFetching, reachedEnd]
  );

  const breakpointColumnsObj = {
    default: 2,
    700: 1,
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.myMasonryGrid}
        columnClassName={styles.myMasonryGridColumn}
      >
        {events?.map(
          (event) => event && <EventCard key={event._id} event={event} />
        )}
      </Masonry>
      {loadingDiv}
    </>
  );
}
