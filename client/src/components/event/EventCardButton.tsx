import { IconType } from "react-icons";
import styles from "./EventCardButton.module.scss";

type EventCardButtonProps = {
  icon: IconType;
  text: string;
  onClick: () => void;
};

export default function EventCardButton(props: EventCardButtonProps) {
  return (
    <button className={styles.EventCardButton} onClick={props.onClick}>
      <props.icon />
      <strong>{props.text}</strong>
    </button>
  );
}
