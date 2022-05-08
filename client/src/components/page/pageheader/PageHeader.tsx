import "./PageHeader.css";

type PageHeaderProps = {
  title?: string;
};

export default function PageHeader(props: PageHeaderProps) {
  return (
    <div className="PageHeader">
      {props.title && <h1 className="PageHeaderTitle">{props.title}</h1>}
    </div>
  );
}
