import "./ContentWarning.css";

export type ContentWarningProps = {
  ContentWarningText: string;
};

function ContentWarning(props: ContentWarningProps) {
  return (
    <div className="ContentWarning">
      <p>{props.ContentWarningText}</p>
    </div>
  );
}

export default ContentWarning;
