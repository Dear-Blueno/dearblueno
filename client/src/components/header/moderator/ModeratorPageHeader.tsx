import styles from "./ModeratorPageHeader.module.scss";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

enum ModeratorSelection {
  Posts,
  Comments,
  Reports,
  Events,
}

const options = ["Posts", "Comments", "Reports", "Events"];

export default function ModeratorPageHeader() {
  const postsRef = useRef<HTMLHeadingElement>(null);
  const commentsRef = useRef<HTMLHeadingElement>(null);
  const reportsRef = useRef<HTMLHeadingElement>(null);
  const eventsRef = useRef<HTMLHeadingElement>(null);
  const refs = useMemo(
    () => [postsRef, commentsRef, reportsRef, eventsRef],
    []
  );
  const underlineRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const [active, setActive] = useState<ModeratorSelection>(
    ModeratorSelection.Posts
  );

  const handleSwitch = useCallback(() => {
    const selectedRef = refs[active];
    const leftAdjust = active === ModeratorSelection.Posts ? -1.5 : -2;
    if (underlineRef.current && selectedRef.current) {
      underlineRef.current.style.left = `${
        selectedRef.current.offsetLeft + leftAdjust
      }px`;
      underlineRef.current.style.width = `${
        selectedRef.current.offsetWidth + 4
      }px`;
    }
  }, [active, refs]);

  useEffect(handleSwitch, [handleSwitch]);

  useEffect(() => {
    const sort = router.query.sort as string;
    if (!sort) {
      setActive(ModeratorSelection.Posts);
    } else {
      const index = options.map((option) => option.toLowerCase()).indexOf(sort);
      if (index !== -1) {
        setActive(index);
      }
    }
  }, [router.query.sort]);

  useEffect(() => {
    window.addEventListener("resize", handleSwitch);
    return () => {
      window.removeEventListener("resize", handleSwitch);
    };
  }, [handleSwitch]);

  return (
    <div className={styles.MainFeedHeader}>
      {options.map((option, index) => (
        <div
          key={option}
          className={styles.MainFeedHeaderOption}
          onClick={() => {
            setActive(index);
            void router.push(
              index === 0 ? "" : `/moderator/?sort=${option.toLowerCase()}`
            );
          }}
        >
          <h3 className={styles.MainFeedHeaderOptionText} ref={refs[index]}>
            {option}
          </h3>
        </div>
      ))}
      <span className={styles.FeedSelectionUnderline} ref={underlineRef} />
    </div>
  );
}
