import "./PostNumber.css";

interface PostNumberProps {
    value: number;
}

function PostNumber(props : PostNumberProps) {
    return (
      <div className="PostNumber">
          <h3>#{props.value}</h3>
      </div>
    );
  }
  
  export default PostNumber;