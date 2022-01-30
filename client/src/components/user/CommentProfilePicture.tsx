import "./CommentProfilePicture.css";
import { MdPersonOutline } from "react-icons/md";

interface CommentProfilePictureProps {
  link?: string;
}

function CommentProfilePicture(props: CommentProfilePictureProps) {
  return (
    <div className="CommentProfilePicture">
      {props.link ? (
        <img
          className="CommentProfilePictureImage"
          src={props.link}
          alt=""
          draggable={false}
        />
      ) : (
        <MdPersonOutline className="CommentProfilePictureImage" />
      )}
    </div>
  );
}

export default CommentProfilePicture;
