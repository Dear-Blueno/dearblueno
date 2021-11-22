import "./HomeButton.css";

interface HomeButtonProps {
  action: () => void;
  image: string;
  alt: string;
}

/*This div should be a button that, on click, calls the action prop. */
function HomeButton(props: HomeButtonProps) {
  return (
    <div className="HomeButton" onClick={props.action}>
      <img className="HomeButtonImage" src={props.image} alt={props.alt} />
    </div>
  );
}

export default HomeButton;
