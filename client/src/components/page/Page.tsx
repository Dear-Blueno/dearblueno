import "./Page.css";
import PageHeader from "./pageheader/PageHeader";

type PageProps = {
  title?: string;
  children?: React.ReactNode;
};

export default function Page(props: PageProps) {
  return (
    <div className="Page">
      <PageHeader title={props.title} />
      {props.children}
    </div>
  );
}
