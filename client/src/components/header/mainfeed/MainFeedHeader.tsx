import styles from "./MainFeedHeader.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";

enum FeedSort {
  Hot,
  Top,
  New,
}

export default function MainFeedHeader() {
  const hotRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLHeadingElement>(null);
  const newRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<FeedSort>(FeedSort.Hot);

  const handleSwitch = useCallback(() => {
    const refs = [hotRef, topRef, newRef];
    const selectedRef = refs[active];
    if (underlineRef.current && selectedRef.current) {
      if (active === FeedSort.New) {
        underlineRef.current.style.left = `${
          selectedRef.current.offsetLeft - 2
        }px`;
        underlineRef.current.style.width = `${
          selectedRef.current.offsetWidth + 4
        }px`;
      } else {
        underlineRef.current.style.left = `${
          selectedRef.current.offsetLeft - 1
        }px`;
        underlineRef.current.style.width = `${
          selectedRef.current.offsetWidth + 4
        }px`;
      }
    }
  }, [active]);

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
        onClick={() => setActive(FeedSort.Hot)}
      >
        <h3 className={styles.MainFeedHeaderOptionText} ref={hotRef}>
          Hot
        </h3>
      </div>
      <div
        className={styles.MainFeedHeaderOption}
        onClick={() => setActive(FeedSort.Top)}
      >
        <h3 className={styles.MainFeedHeaderOptionText} ref={topRef}>
          Top
        </h3>
      </div>
      <div
        className={styles.MainFeedHeaderOption}
        onClick={() => setActive(FeedSort.New)}
      >
        <h3 className={styles.MainFeedHeaderOptionText} ref={newRef}>
          New
        </h3>
      </div>
      <span className={styles.FeedSelectionUnderline} ref={underlineRef} />
    </div>
  );
}
