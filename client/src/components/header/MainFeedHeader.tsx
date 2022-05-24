import styles from "./MainFeedHeader.module.scss";
import { useEffect, useRef, useState } from "react";

type MainFeedHeaderProps = {};

export default function MainFeedHeader(props: MainFeedHeaderProps) {
  const hotRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLHeadingElement>(null);
  const newRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string>("hot");

  const switchFeed = (selected: string) => {
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

  const handleSwitch = () => {
    const selectedRef = switchFeed(active);
    if (underlineRef.current && selectedRef.current) {
      underlineRef.current.style.left =
        selectedRef.current.offsetLeft + 4 + "px";
      underlineRef.current.style.width =
        selectedRef.current.offsetWidth - 8 + "px";
    }
  };

  useEffect(handleSwitch, [active]);

  useEffect(() => {
    window.addEventListener("resize", handleSwitch);
    return () => {
      window.removeEventListener("resize", handleSwitch);
    };
  }, []);

  return (
    <div className={styles.MainFeedHeader}>
      <h3
        className={styles.MainFeedHeaderOption}
        ref={hotRef}
        onClick={() => setActive("hot")}
      >
        Hot
      </h3>
      <h3
        className={styles.MainFeedHeaderOption}
        ref={topRef}
        onClick={() => setActive("top")}
      >
        Top
      </h3>
      <h3
        className={styles.MainFeedHeaderOption}
        ref={newRef}
        onClick={() => setActive("new")}
      >
        New
      </h3>
      <span className={styles.FeedSelectionUnderline} ref={underlineRef} />
    </div>
  );
}
