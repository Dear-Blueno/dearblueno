import Image from "next/image";
import styles from "./ProfilePicture.module.scss";

interface ProfilePictureProps {
  link: string;
}

function ProfilePicture(props: ProfilePictureProps) {
  return (
    <div className={styles.ProfilePicture}>
      <Image
        className={styles.ProfilePictureImage}
        src={props.link}
        alt=""
        draggable={false}
      />
    </div>
  );
}

export default ProfilePicture;
