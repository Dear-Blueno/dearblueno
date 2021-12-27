import "./NewCommentBoxFooter.css";
import SubmitCommentButton from "./SubmitCommentButton";

type NewCommentBoxFooterProps = {
  submit: () => void;
};

function NewCommentBoxFooter(props: NewCommentBoxFooterProps) {
  return (
    <div className="NewCommentBoxFooter">
      <SubmitCommentButton handleClick={props.submit} />
    </div>
  );
}

export default NewCommentBoxFooter;
