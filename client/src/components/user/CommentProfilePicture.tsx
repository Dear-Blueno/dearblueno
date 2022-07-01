import styles from "./CommentProfilePicture.module.scss";
import { MdPersonOutline } from "react-icons/md";
import Image from "next/image";

interface CommentProfilePictureProps {
  link?: string;
}

function CommentProfilePicture(props: CommentProfilePictureProps) {
  return (
    <div className={styles.CommentProfilePicture}>
      {props.link ? (
        <div className={styles.CommentProfilePictureImage}>
          <Image
            src={props.link}
            priority
            alt=""
            draggable={false}
            width="100"
            height="100%"
          />
        </div>
      ) : (
        <MdPersonOutline className={styles.CommentProfilePictureImage} />
      )}
    </div>
  );
}

export default CommentProfilePicture;
