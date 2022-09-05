import "./ModeratorSelection.css";

interface ModeratorSelectionProps {
  selection: boolean;
  toggle: () => void;
}

function ModeratorSelection(props: ModeratorSelectionProps) {
  const postClass = props.selection ? "Selected" : "";
  const commentClass = props.selection ? "" : "Selected";
  return (
    <div className="ModeratorSelection">
      <button
        className={"ModeratorSelectionButton " + postClass}
        onClick={props.toggle}
      >
        Posts
      </button>
      <button
        className={"ModeratorSelectionButton " + commentClass}
        onClick={props.toggle}
      >
        Comments
      </button>
    </div>
  );
}

export default ModeratorSelection;
