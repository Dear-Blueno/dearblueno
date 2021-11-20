import "./ThreadCollapser.css";

type ThreadCollapserProps = {
  collapse: () => void;
};

function ThreadCollapser(props: ThreadCollapserProps) {
  return (
    <div className="ThreadCollapser">
      <div
        className="ThreadCollapserClickable"
        onClick={() => props.collapse()}
      >
        <div className="ThreadCollapserLine"></div>
      </div>
    </div>
  );
}

export default ThreadCollapser;
