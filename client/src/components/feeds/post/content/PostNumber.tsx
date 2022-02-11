import "./PostNumber.css";

interface PostNumberProps {
  number?: number;
  _id?: string;
}

function PostNumber(props: PostNumberProps) {
  return (
    <div className="PostNumber">
      <h3>
        {props.number ? (
          <a
            href={`/posts/${props.number}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            #{props.number}
          </a>
        ) : (
          "id: " + props._id
        )}
      </h3>
    </div>
  );
}

export default PostNumber;
