import "./ProfileSaveButton.css";

interface ProfileSaveButtonProps {
  click: () => void;
}

function ProfileSaveButton(props: ProfileSaveButtonProps) {
  return (
    <div className="ProfileSaveButtonContainer">
      <button className="ProfileButton ProfileSaveButton" onClick={props.click}>
        Save
      </button>
    </div>
  );
}

export default ProfileSaveButton;
