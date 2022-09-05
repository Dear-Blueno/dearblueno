import styles from "./ProfileName.module.scss";

interface ProfileNameProps {
  name: string;
  pronouns?: string;
}

function ProfileName(props: ProfileNameProps) {
  return (
    <div className={styles.ProfileName}>
      {props.name}
      {props.pronouns && (
        <p className={styles.ProfilePronouns}>({props.pronouns})</p>
      )}
    </div>
  );
}

export default ProfileName;
