import "./CommentProfilePicture.css";

interface CommentProfilePictureProps {
  link: string;
}

function CommentProfilePicture(props: CommentProfilePictureProps) {
  return (
    <div className="CommentProfilePicture">
      <img className="CommentProfilePictureImage" src={props.link} alt="" />
    </div>
  );
}

export default CommentProfilePicture;