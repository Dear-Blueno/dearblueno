import { Link } from "react-router-dom";
import IPost from "types/IPost";
import "./PostNumber.css";

interface PostNumberProps {
  number?: number;
  _id?: string;
  post: IPost;
}

function PostNumber(props: PostNumberProps) {
  return (
    <div className="PostNumber">
      <h3>
        {props.number ? (
          <Link
            state={{ post: props.post }}
            to={`/post/${props.number}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            #{props.number}
          </Link>
        ) : (
          "id: " + props._id
        )}
      </h3>
    </div>
  );
}

export default PostNumber;
