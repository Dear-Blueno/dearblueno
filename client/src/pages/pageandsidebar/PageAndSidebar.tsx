import "./PageAndSidebar.css";

interface FeedPageProps {
  page: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function PageAndSidebar(props: FeedPageProps) {
  return (
    <>
      {props.page}
      {props.sidebar}
    </>
  );
}
