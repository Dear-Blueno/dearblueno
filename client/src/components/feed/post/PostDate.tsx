import "./PostDate.css";

interface PostDateProps {
    value: string;
}

function PostDate(props : PostDateProps) {
    return (
      <div className="PostDate">
          <p>{props.value}</p>
      </div>
    );
  }
  
  export default PostDate;