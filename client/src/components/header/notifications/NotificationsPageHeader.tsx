import styles from "./NotificationsPageHeader.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

enum NotificationsSort {
  Unread,
  All,
}

const options = ["Unread", "All"];

export default function NotificationsPageHeader() {
  const unreadRef = useRef<HTMLHeadingElement>(null);
  const allRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const [active, setActive] = useState<NotificationsSort>(
    router.query.sort ? NotificationsSort.All : NotificationsSort.Unread
  );

  const handleSwitch = useCallback(() => {
    const refs = [unreadRef, allRef];
    const selectedRef = refs[active];
    const leftAdjust = active === NotificationsSort.Unread ? -1.5 : -2;
    if (underlineRef.current && selectedRef.current) {
      underlineRef.current.style.left = `${
        selectedRef.current.offsetLeft + leftAdjust
      }px`;
      underlineRef.current.style.width = `${
        selectedRef.current.offsetWidth + 4
      }px`;
    }
  }, [active]);

  useEffect(() => {
    const sort = router.query.sort as string;
    if (!sort) {
      setActive(NotificationsSort.Unread);
    } else {
      const index = options.map((option) => option.toLowerCase()).indexOf(sort);
      if (index !== -1) {
        setActive(index);
      }
    }
  }, [router.query.sort]);

  useEffect(handleSwitch, [handleSwitch]);

  useEffect(() => {
    window.addEventListener("resize", handleSwitch);
    return () => {
      window.removeEventListener("resize", handleSwitch);
    };
  }, [handleSwitch]);

  return (
    <div className={styles.MainFeedHeader}>
      <div
        className={styles.MainFeedHeaderOption}
        onClick={() => {
          setActive(NotificationsSort.Unread);
          void router.push("/notifications");
        }}
      >
        <h3 className={styles.MainFeedHeaderOptionText} ref={unreadRef}>
          Unread
        </h3>
      </div>
      <div
        className={styles.MainFeedHeaderOption}
        onClick={() => {
          setActive(NotificationsSort.All);
          void router.push("/notifications?sort=all");
        }}
      >
        <h3 className={styles.MainFeedHeaderOptionText} ref={allRef}>
          All
        </h3>
      </div>
      <span className={styles.FeedSelectionUnderline} ref={underlineRef} />
    </div>
  );
}
