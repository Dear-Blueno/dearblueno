import styles from "./ProfileCancelButton.module.scss";

interface ProfileCancelButtonProps {
  click: () => void;
}

function ProfileCancelButton(props: ProfileCancelButtonProps) {
  return (
    <div className={styles.ProfileCancelButtonContainer}>
      <button
        className={styles.ProfileButton + " " + styles.ProfileCancelButton}
        onClick={props.click}
      >
        Cancel
      </button>
    </div>
  );
}

export default ProfileCancelButton;
