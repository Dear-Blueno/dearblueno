import styles from "./ProfileBio.module.scss";
import UserContent from "../../post/content/UserContent";

interface ProfileBioProps {
  bio: string;
  bioRef: React.RefObject<HTMLTextAreaElement>;
  editing: boolean;
}

function ProfileBio(props: ProfileBioProps) {
  if (!props.editing && !props.bio) {
    return null;
  }

  return (
    <div className={styles.ProfileBio}>
      {props.editing ? (
        <div className="ProfileBioEditing">
          <div className={styles.ProfileBioEditingHeader}>Bio</div>

          <textarea
            ref={props.bioRef}
            className={styles.ProfileBioTextArea}
            defaultValue={props.bio}
          ></textarea>
        </div>
      ) : (
        <UserContent>{props.bio}</UserContent>
      )}
    </div>
  );
}

export default ProfileBio;
