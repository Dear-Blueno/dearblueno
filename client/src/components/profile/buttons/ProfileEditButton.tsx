import "./ProfileEditButton.css";

interface ProfileEditButtonProps {
  click: () => void;
}

function ProfileEditButton(props: ProfileEditButtonProps) {
  return (
    <div className="ProfileEditButtonContainer">
      <button className="ProfileButton ProfileEditButton" onClick={props.click}>
        Edit Profile
      </button>
    </div>
  );
}

export default ProfileEditButton;
