import styles from "./ProfileEditButton.module.scss";

interface ProfileEditButtonProps {
  click: () => void;
}

function ProfileEditButton(props: ProfileEditButtonProps) {
  return (
    <div className={styles.ProfileEditButtonContainer}>
      <button
        className={styles.ProfileButton + " " + styles.ProfileEditButton}
        onClick={props.click}
      >
        Edit Profile
      </button>
    </div>
  );
}

export default ProfileEditButton;
