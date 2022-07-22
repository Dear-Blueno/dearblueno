import styles from "./MainFeedHeader.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";

export default function MainFeedHeader() {
  const hotRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLHeadingElement>(null);
  const newRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<"hot" | "top" | "new">("hot");

  const switchFeed = (selected: "hot" | "top" | "new") => {
    switch (selected) {
      case "hot":
        // get hot
        return hotRef;
      case "top":
        return topRef;
      case "new":
        // get new
        return newRef;
      default:
        return hotRef;
    }
  };

  const handleSwitch = useCallback(() => {
    const selectedRef = switchFeed(active);
    if (underlineRef.current && selectedRef.current) {
      if (active === "new") {
        underlineRef.current.style.left =
          selectedRef.current.offsetLeft - 2 + "px";
        underlineRef.current.style.width =
          selectedRef.current.offsetWidth + 4 + "px";
      } else {
        underlineRef.current.style.left =
          selectedRef.current.offsetLeft - 1 + "px";
        underlineRef.current.style.width =
          selectedRef.current.offsetWidth + 4 + "px";
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
      <div className={styles.MainFeedHeaderOption}>
        <h3
          className={styles.MainFeedHeaderOptionText}
          ref={hotRef}
          onClick={() => setActive("hot")}
        >
          Hot
        </h3>
      </div>
      <div className={styles.MainFeedHeaderOption}>
        <h3
          className={styles.MainFeedHeaderOptionText}
          ref={topRef}
          onClick={() => setActive("top")}
        >
          Top
        </h3>
      </div>
      <div className={styles.MainFeedHeaderOption}>
        <h3
          className={styles.MainFeedHeaderOptionText}
          ref={newRef}
          onClick={() => setActive("new")}
        >
          New
        </h3>
      </div>
      <span className={styles.FeedSelectionUnderline} ref={underlineRef} />
    </div>
  );
}
