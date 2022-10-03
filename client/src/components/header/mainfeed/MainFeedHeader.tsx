import styles from "./MainFeedHeader.module.scss";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { RiSearch2Line, RiSortDesc } from "react-icons/ri";
import Link from "next/link";
import { useIsMobile } from "hooks/is-mobile";

export type SortType = "hot" | "topWeek" | "topMonth" | "new" | "topAllTime";

export const parseSortQueryParams = (
  sort: string | string[] | undefined,
  of: string | string[] | undefined
): SortType => {
  if (sort) {
    const sortType = sort as string;
    if (sortType === "top") {
      if (of === "week") {
        return "topWeek";
      } else if (of === "month") {
        return "topMonth";
      } else if (of === "alltime") {
        return "topAllTime";
      }
    } else if (sortType === "hot" || sortType === "new") {
      return sortType;
    }
  }
  return "hot";
};

interface Props {
  showingPicker: boolean;
  setShowingPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MainFeedHeader(props: Props) {
  const isMobile = useIsMobile();
  if (isMobile && !props.showingPicker) {
    return (
      <div className={styles.MainFeedHeader}>
        <button
          className={`${styles.MobileSearchIcon}, ${styles.MainFeedSortButton}`}
          onClick={() => props.setShowingPicker(true)}
        >
          <RiSortDesc />
        </button>
        <Link href="/search">
          <RiSearch2Line className={styles.MobileSearchIcon} />
        </Link>
      </div>
    );
  } else {
    return (
      <div className={styles.MainFeedHeader}>
        <FeedPicker onSelect={() => props.setShowingPicker(false)} />
      </div>
    );
  }
}

function FeedPicker({ onSelect }: { onSelect: () => void }) {
  const hotRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLHeadingElement>(null);
  const newRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const [choosingTop, setChoosingTop] = useState<boolean>(false);

  const parseSortQueryParamsCallback = useCallback(
    (): SortType => parseSortQueryParams(router.query.sort, router.query.of),
    [router.query.sort, router.query.of]
  );

  const [sort, setSort] = useState<SortType>(parseSortQueryParamsCallback());

  useEffect(() => {
    setSort(parseSortQueryParamsCallback());
  }, [parseSortQueryParamsCallback]);

  const underlinedRef = useMemo(() => {
    if (sort === "hot") {
      return hotRef;
    } else if (
      sort === "topMonth" ||
      sort === "topWeek" ||
      sort === "topAllTime"
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
        case "topAllTime":
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

  let topRefText: string;
  if (choosingTop) {
    topRefText = "Month";
  } else {
    if (sort === "topWeek") {
      topRefText = "Week";
    } else if (sort === "topMonth") {
      topRefText = "Month";
    } else if (sort === "topAllTime") {
      topRefText = "All time";
    } else {
      topRefText = "Top";
    }
  }

  return (
    <div
      className={styles.MainFeedHeader}
      onMouseLeave={() => {
        if (!sort.startsWith("top")) {
          setChoosingTop(false);
        }
        onSelect();
      }}
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
          onSelect();
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
            onSelect();
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
            setSort("topAllTime");
            setChoosingTop(false);
            void router.push("/?sort=top&of=alltime");
          } else {
            setSort("new");
            void router.push("/?sort=new");
          }
          onSelect();
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
