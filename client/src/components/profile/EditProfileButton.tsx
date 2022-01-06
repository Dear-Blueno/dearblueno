import "./EditProfileButton.css";

interface EditProfileButtonProps {
  click: () => void;
}

function EditProfileButton(props: EditProfileButtonProps) {
  return (
    <div className="EditProfileButtonContainer">
      <button className="EditProfileButton" onClick={props.click}>
        Edit Profile
      </button>
    </div>
  );
}

export default EditProfileButton;
