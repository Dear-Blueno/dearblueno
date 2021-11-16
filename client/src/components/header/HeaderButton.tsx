import "./HeaderButton.css";

interface HeaderButtonProps {
  action: () => void;
  image: string;
}

/*This div should be a button that, on clinck, calls the action prop. */
function HeaderButton(props: HeaderButtonProps) {
  return (
    <div className="HeaderButton" onClick={props.action}>
      <img className="HeaderButtonImage" src={props.image} />
    </div>
  );
}

export default HeaderButton;
