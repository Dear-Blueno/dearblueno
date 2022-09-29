import styles from "./MainFeedHeader.module.scss";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import useUser from "hooks/useUser";
import IUser from "types/IUser";
import { RiSearch2Line } from "react-icons/ri";
import Link from "next/link";

export type SortType = "hot" | "topWeek" | "topMonth" | "new" | "topAllTime";

export const parseSortQueryParamsOnly = (
  sort: string | string[] | undefined,
  of: string | string[] | undefined
): SortType | "default" => {
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
  return "default";
};
export const parseSortQueryParams = (
  sort: string | string[] | undefined,
  of: string | string[] | undefined,
  user: IUser | undefined
): SortType => {
  const type = parseSortQueryParamsOnly(sort, of);
  return type === "default" ? user?.settings.homeFeedSort ?? "hot" : type;
};

export default function MainFeedHeader() {
  const { user } = useUser();
  const router = useRouter();
  const parseSortQueryParamsCallback = useCallback(
    (): SortType =>
      parseSortQueryParams(router.query.sort, router.query.of, user),
    [router.query.sort, router.query.of, user]
  );

  useEffect(() => {
    setSort(parseSortQueryParamsCallback());
  }, [parseSortQueryParamsCallback]);

  const [sort, setSort] = useState<SortType>(parseSortQueryParamsCallback());

  const [oldSort, setOldSort] = useState<SortType>(sort);
  useEffect(() => {
    if (sort === oldSort) return;
    setOldSort(sort);

    if (sort === (user?.settings.homeFeedSort ?? "hot")) {
      void router.push("/");
      return;
    }

    switch (sort) {
      case "hot":
        void router.push("/?sort=hot");
        break;
      case "new":
        void router.push("/?sort=new");
        break;

      case "topWeek":
        void router.push("/?sort=top&of=week");
        break;
      case "topMonth":
        void router.push("/?sort=top&of=month");
        break;
      case "topAllTime":
        void router.push("/?sort=top&of=alltime");
        break;
    }
  }, [sort, oldSort, router, user?.settings.homeFeedSort]);

  return <FeedPicker sort={sort} setSort={setSort} />;
}

export function FeedPicker({
  sort,
  setSort,
}: {
  sort: SortType;
  setSort: React.Dispatch<React.SetStateAction<SortType>>;
}) {
  const hotRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLHeadingElement>(null);
  const newRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [choosingTop, setChoosingTop] = useState<boolean>(false);

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
      onMouseLeave={() => !sort.startsWith("top") && setChoosingTop(false)}
    >
      <div
        className={styles.MainFeedHeaderOption}
        onClick={() => {
          if (choosingTop) {
            setSort("topWeek");
            setChoosingTop(false);
          } else {
            setSort("hot");
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
          } else {
            setSort("new");
          }
        }}
      >
        <h3 className={styles.MainFeedHeaderOptionText} ref={newRef}>
          {choosingTop ? "All time" : "New"}
        </h3>
      </div>
      <span className={styles.FeedSelectionUnderline} ref={underlineRef} />
      <Link href="/search">
        <RiSearch2Line className={styles.MobileSearchIcon} />
      </Link>
    </div>
  );
}
