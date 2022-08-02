import styles from "./MainFeedHeader.module.scss";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

type SortType = "hot" | "topWeek" | "topMonth" | "new" | "topAlltime";

export default function MainFeedHeader() {
  const hotRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLHeadingElement>(null);
  const newRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const [choosingTop, setChoosingTop] = useState<boolean>(false);

  const parseSortQueryParams = useCallback((): SortType => {
    if (router.query.sort) {
      const sortType = router.query.sort as string;
      if (sortType === "top") {
        if (router.query.of === "week") {
          return "topWeek";
        } else if (router.query.of === "month") {
          return "topMonth";
        } else if (router.query.of === "alltime") {
          return "topAlltime";
        }
      } else if (sortType === "hot" || sortType === "new") {
        return sortType;
      }
    }
    return "hot";
  }, [router.query.sort, router.query.of]);

  const [sort, setSort] = useState<SortType>(parseSortQueryParams());

  useEffect(() => {
    setSort(parseSortQueryParams());
  }, [parseSortQueryParams]);

  const underlinedRef = useMemo(() => {
    if (sort === "hot") {
      return hotRef;
    } else if (
      sort === "topMonth" ||
      sort === "topWeek" ||
      sort === "topAlltime"
    ) {
      return topRef;
    } else {
      return newRef;
    }
  }, [sort]);

  useEffect(() => {
    if (underlineRef.current) {
      if (choosingTop) {
        underlineRef.current.style.display = "none";
      } else {
        underlineRef.current.style.display = "block";
      }
    }
  }, [choosingTop, underlineRef, underlinedRef, sort]);

  const moveUnderline = useCallback(() => {
    if (underlineRef.current && underlinedRef.current) {
      let leftAdjust = 0;
      const widthAdjust = 4;
      switch (sort) {
        case "hot":
          leftAdjust = -1;
          break;
        case "topWeek":
          leftAdjust = -1.5;
          break;
        case "topMonth":
          leftAdjust = -2.5;
          break;
        case "topAlltime":
          leftAdjust = -2;
          break;
        case "new":
          leftAdjust = -2;
          break;
      }

      underlineRef.current.style.left = `${
        underlinedRef.current.offsetLeft + leftAdjust
      }px`;
      underlineRef.current.style.width = `${
        underlinedRef.current.offsetWidth + widthAdjust
      }px`;
    }
  }, [sort, underlineRef, underlinedRef]);

  useEffect(moveUnderline, [moveUnderline]);

  useEffect(() => {
    window.addEventListener("resize", moveUnderline);
    return () => {
      window.removeEventListener("resize", moveUnderline);
    };
  }, [moveUnderline]);

  let topRefText;
  if (choosingTop) {
    topRefText = "Month";
  } else {
    if (sort === "topWeek") {
      topRefText = "Week";
    } else if (sort === "topMonth") {
      topRefText = "Month";
    } else if (sort === "topAlltime") {
      topRefText = "All time";
    } else {
      topRefText = "Top";
    }
  }

  return (
    <div
      className={styles.MainFeedHeader}
      onMouseLeave={() => !sort.startsWith("top") && setChoosingTop(false)}
    >
      <div
        className={styles.MainFeedHeaderOption}
        onClick={() => {
          if (choosingTop) {
            setSort("topWeek");
            setChoosingTop(false);
            void router.push("/?sort=top&of=week");
          } else {
            setSort("hot");
            void router.push("/");
          }
        }}
      >
        <h3 className={styles.MainFeedHeaderOptionText} ref={hotRef}>
          {choosingTop ? "Week" : "Hot"}
        </h3>
      </div>
      <div
        className={styles.MainFeedHeaderOption}
        onClick={() => {
          if (!choosingTop) {
            setChoosingTop(true);
          } else {
            setSort("topMonth");
            setChoosingTop(false);
            void router.push("/?sort=top&of=month");
          }
        }}
      >
        <h3 className={styles.MainFeedHeaderOptionText} ref={topRef}>
          {topRefText}
        </h3>
      </div>
      <div
        className={styles.MainFeedHeaderOption}
        onClick={() => {
          if (choosingTop) {
            setSort("topAlltime");
            setChoosingTop(false);
            void router.push("/?sort=top&of=alltime");
          } else {
            setSort("new");
            void router.push("/?sort=new");
          }
        }}
      >
        <h3 className={styles.MainFeedHeaderOptionText} ref={newRef}>
          {choosingTop ? "All time" : "New"}
        </h3>
      </div>
      <span className={styles.FeedSelectionUnderline} ref={underlineRef} />
    </div>
  );
}
