import styles from "./SocialButton.module.scss";
import { IconType } from "react-icons/lib";

interface SocialButtonProps {
  link: string;
  icon: IconType;
}

function SocialButton(props: SocialButtonProps) {
  return (
    <div className="SocialButton">
      <a
        className={styles.SocialButtonLink}
        href={props.link}
        target="_blank"
        rel="noreferrer"
        draggable={false}
      >
        <props.icon className={styles.SocialButtonIcon} size="1.2em" />
      </a>
    </div>
  );
}

export default SocialButton;
