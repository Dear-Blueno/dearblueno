import "./FeedPage.css";

interface FeedPageProps {
  children: React.ReactNode;
}

function FeedPage(props: FeedPageProps) {
  return <div className="FeedPage">{props.children}</div>;
}

export default FeedPage;
