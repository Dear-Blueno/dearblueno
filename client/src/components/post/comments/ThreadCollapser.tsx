import styles from "./ThreadCollapser.module.scss";
import { useRef } from "react";

type ThreadCollapserProps = {
  collapse: () => void;
  color: string;
};

function ThreadCollapser(props: ThreadCollapserProps) {
  const line = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.ThreadCollapser}>
      <div
        className={styles.ThreadCollapserClickable}
        onClick={() => props.collapse()}
        onMouseEnter={() =>
          line.current?.classList.add(styles.ThreadCollapserLineHover)
        }
        onMouseLeave={() =>
          line.current?.classList.remove(styles.ThreadCollapserLineHover)
        }
      >
        <div
          className={styles.ThreadCollapserLine}
          ref={line}
          style={{ backgroundColor: props.color }}
        ></div>
      </div>
    </div>
  );
}

export default ThreadCollapser;
