import "./ProfileCancelButton.css";

interface ProfileCancelButtonProps {
  click: () => void;
}

function ProfileCancelButton(props: ProfileCancelButtonProps) {
  return (
    <div className="ProfileCancelButtonContainer">
      <button
        className="ProfileButton ProfileCancelButton"
        onClick={props.click}
      >
        Cancel
      </button>
    </div>
  );
}

export default ProfileCancelButton;
