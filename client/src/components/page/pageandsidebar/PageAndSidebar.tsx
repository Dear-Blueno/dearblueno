import Page from "../Page";
import "./PageAndSidebar.css";

interface FeedPageProps {
  title?: string;
  page: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function PageAndSidebar(props: FeedPageProps) {
  return (
    <>
      <Page title={props.title}>{props.page}</Page>
      <div className="PageAndSidebar-Sidebar">{props.sidebar}</div>
    </>
  );
}
