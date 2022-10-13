import Image from "next/image";
import styles from "./ProfilePicture.module.scss";

interface ProfilePictureProps {
  link: string;
  hidden: boolean;
}

function ProfilePicture(props: ProfilePictureProps) {
  const src = props.link.replace("=s96-c", "=s1024-c");
  return (
    <div className={styles.ProfilePicture} hidden={props.hidden}>
      <Image
        className={styles.ProfilePictureImage}
        src={src}
        alt=""
        draggable={false}
        width={240}
        height={240}
        layout="responsive"
        priority
      />
    </div>
  );
}

export default ProfilePicture;
