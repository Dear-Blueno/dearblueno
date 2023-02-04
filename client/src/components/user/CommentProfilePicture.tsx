import styles from "./CommentProfilePicture.module.scss";
import Image from "next/image";
import { IoPersonOutline } from "react-icons/io5";
import { MdBlockFlipped } from "react-icons/md";

interface CommentProfilePictureProps {
  link?: string;
}

function CommentProfilePicture(props: CommentProfilePictureProps) {
  return (
    <div className={styles.CommentProfilePicture}>
      {props.link && props.link !== "blocked" ? (
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
      ) : props.link === "blocked" ? (
        <MdBlockFlipped className={styles.CommentProfilePictureImage} />
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
