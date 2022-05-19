import styles from "./ProfilePicture.module.scss";

interface ProfilePictureProps {
  link: string;
}

function ProfilePicture(props: ProfilePictureProps) {
  return (
    <div className={styles.ProfilePicture}>
      <img
        className={styles.ProfilePictureImage}
        src={props.link}
        alt=""
        draggable={false}
      />
    </div>
  );
}

export default ProfilePicture;
