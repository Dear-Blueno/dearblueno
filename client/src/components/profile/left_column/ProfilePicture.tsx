import Image from "next/image";
import styles from "./ProfilePicture.module.scss";

interface ProfilePictureProps {
  link: string;
}

function ProfilePicture(props: ProfilePictureProps) {
  const src = props.link.replace("=s96-c", "=s1024-c");
  return (
    <div className={styles.ProfilePicture}>
      <Image
        className={styles.ProfilePictureImage}
        src={src}
        alt=""
        draggable={false}
        width={1024}
        height={1024}
        layout="responsive"
        priority
      />
    </div>
  );
}

export default ProfilePicture;
