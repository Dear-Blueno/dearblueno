import "./HeaderButton.css";
import { IconType } from "react-icons/lib";

interface HeaderButtonProps {
  action: () => void;
  icon: IconType | undefined;
  image?: string;
  alt: string;
  opacity?: number;
  delay?: string;
  buttonRef?: any;
}

/*This div should be a button that, on click, calls the action prop. */
function HeaderButton(props: HeaderButtonProps) {
  return (
    <div
      className="HeaderButton"
      onClick={props.action}
      style={{ opacity: props.opacity ?? 1 , animationDelay: props.delay ?? "0ms" }}
      ref={props.buttonRef}
    >
      {props.icon ? (
        <props.icon className="HeaderButtonIcon" title={props.alt} />
      ) : (
        <img
          className="HeaderButtonImage"
          alt={props.alt}
          src={props.image}
          draggable={false}
        ></img>
      )}
    </div>
  );
}

export default HeaderButton;
