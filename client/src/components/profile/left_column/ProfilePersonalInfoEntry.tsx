import styles from "./ProfilePersonalInfoEntry.module.scss";
import { IconType } from "react-icons/lib";

interface ProfilePersonalInfoEntryProps {
  content: string;
  icon: IconType;
}

function ProfilePersonalInfoEntry(props: ProfilePersonalInfoEntryProps) {
  return (
    <div className={styles.ProfilePersonalInfoEntry}>
      {<props.icon className="ProfilePersonalInfoEntryIcon" size="1.2em" />}
      <p className={styles.ProfilePersonalInfoEntryContent}>{props.content}</p>
    </div>
  );
}

export default ProfilePersonalInfoEntry;
