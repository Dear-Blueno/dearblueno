import styles from "./LevelAndXPBar.module.scss";
import XPBar from "./XPBar";

interface LevelAndXPBarProps {
  xp: number;
}

const levelToXp = (level: number) => {
  return Math.pow(1.3, level) - 1;
};

const xpToLevel = (xp: number) => {
  return Math.floor(Math.log(xp + 1) / Math.log(1.3));
};

export default function LevelAndXPBar(props: LevelAndXPBarProps) {
  const level = xpToLevel(props.xp);
  const levelMin = levelToXp(level);
  const levelMax = levelToXp(level + 1);
  const levelXp = props.xp - levelMin;

  return (
    <div
      className={styles.LevelAndXPBar}
      title={`XP: ${Math.floor(levelXp)}/${Math.ceil(levelMax)}`}
    >
      <div className={styles.LevelAndXPBarLevel}>lvl {level}</div>
      <XPBar xp={levelXp} maxXp={levelMax} />
    </div>
  );
}
