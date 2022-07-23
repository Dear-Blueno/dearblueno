import styles from "./XPBar.module.scss";

interface XPBarProps {
  xp: number;
  maxXp: number;
}

export default function XPBar(props: XPBarProps) {
  return (
    <div className={styles.XPBar}>
      <div
        className={styles.XPBarFill}
        style={{ width: `${(props.xp / props.maxXp) * 100}%` }}
      />
    </div>
  );
}
