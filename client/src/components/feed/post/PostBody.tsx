import "./PostBody.css";

interface PostBodyProps {
    body: string;
}

function PostBody(props : PostBodyProps) {
    return (
      <div className="PostBody">
          <p className="PostBody">{props.body}</p>
      </div>
    );
  }
  
  export default PostBody;