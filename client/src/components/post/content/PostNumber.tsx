import styles from "./PostNumber.module.scss";
import IPost from "types/IPost";

interface PostNumberProps {
  number?: number;
  _id?: string;
  post: IPost;
}

function PostNumber(props: PostNumberProps) {
  return (
    <div className={styles.PostNumber}>
      <h3>
        {props.number ? (
          <a
            // state={{ post: props.post }}
            href={`/post/${props.number}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            #{props.number}
          </a>
        ) : (
          <>{`id: ${props._id ?? ""}`}</>
        )}
      </h3>
    </div>
  );
}

export default PostNumber;
