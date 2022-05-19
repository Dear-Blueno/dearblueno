import styles from "./ProfileName.module.scss";

interface ProfileNameProps {
  name: string;
}

function ProfileName(props: ProfileNameProps) {
  return <div className={styles.ProfileName}>{props.name}</div>;
}

export default ProfileName;
