import { IconType } from "react-icons/lib";
import "./SocialButton.css";

interface SocialButtonProps {
  link: string;
  icon: IconType;
}

function SocialButton(props: SocialButtonProps) {
  return (
    <div className="SocialButton">
      <a href={props.link} target="_blank" rel="noreferrer">
        <props.icon className="SocialButtonIcon" size="2em" />
      </a>
    </div>
  );
}

export default SocialButton;