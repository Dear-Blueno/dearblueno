import styles from "./CommentProfilePicture.module.scss";
import Image from "next/image";
import { IoPersonOutline } from "react-icons/io5";

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
        <IoPersonOutline
          className={
            styles.CommentProfilePictureImage + " " + styles.AnonymousImage
          }
        />
      )}
    </div>
  );
}

export default CommentProfilePicture;
