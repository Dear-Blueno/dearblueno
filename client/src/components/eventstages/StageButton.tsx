import styles from "./StageButton.module.scss";

type StageButtonProps = {
  function: () => void;
  text: string;
};

export default function StageButton(props: StageButtonProps) {
  return (
    <button className={styles.StageButton} onClick={props.function}>
      <strong>{props.text}</strong>
    </button>
  );
}
