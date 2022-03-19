import "./PageAndSidebar.css";

interface FeedPageProps {
  page: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function PageAndSidebar(props: FeedPageProps) {
  return (
    <>
      <div className="PageAndSidebar-Page">{props.page}</div>
      <div className="PageAndSidebar-Sidebar">{props.sidebar}</div>
    </>
  );
}
