import styles from "./ProfileSaveButton.module.scss";

interface ProfileSaveButtonProps {
  click: () => void;
}

function ProfileSaveButton(props: ProfileSaveButtonProps) {
  return (
    <div className={styles.ProfileSaveButtonContainer}>
      <button
        className={styles.ProfileButton + " " + styles.ProfileSaveButton}
        onClick={props.click}
      >
        Save
      </button>
    </div>
  );
}

export default ProfileSaveButton;
