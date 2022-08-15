import { IconType } from "react-icons";
import styles from "./EventCardButton.module.scss";

interface EventCardButtonProps {
  icon: IconType;
  text: string;
  onClick: () => void;
  style?: string;
  disabled?: boolean;
}

export default function EventCardButton(props: EventCardButtonProps) {
  return (
    <button
      className={`${styles.EventCardButton} ${props.style ?? ""}`}
      onClick={props.onClick}
      disabled={props.disabled ?? false}
    >
      <props.icon />
      <strong>{props.text}</strong>
    </button>
  );
}
