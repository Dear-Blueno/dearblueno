import "./HeaderButton.css";

interface HeaderButtonProps {
  action: () => void;
  image: string;
  alt: string;
}

/*This div should be a button that, on click, calls the action prop. */
function HeaderButton(props: HeaderButtonProps) {
  return (
    <div className="HeaderButton" onClick={props.action}>
      <img className="HeaderButtonImage" src={props.image} alt={props.alt} />
    </div>
  );
}

export default HeaderButton;
