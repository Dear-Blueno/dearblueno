import "./HeaderButton.css";
import { IconType } from "react-icons/lib";

interface HeaderButtonProps {
  action: () => void;
  icon: IconType | undefined;
  image?: string;
  alt: string;
  opacity: number;
  delay: string;
}

/*This div should be a button that, on click, calls the action prop. */
function HeaderButton(props: HeaderButtonProps) {
  return (
    <div
      className="HeaderButton"
      onClick={props.action}
      style={{ opacity: props.opacity, animationDelay: props.delay }}
    >
      {props.icon ? (
        <props.icon className="HeaderButtonIcon" title={props.alt} />
      ) : (
        <img
          className="HeaderButtonImage"
          alt={props.alt}
          src={props.image}
        ></img>
      )}
    </div>
  );
}

export default HeaderButton;
