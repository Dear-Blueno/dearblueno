import "./PostPage.css";
import Header from "../../components/header/Header";
import IUser from "../../types/IUser";
import { useParams } from "react-router-dom";
import { getPost } from "../../gateways/PostGateway";

interface PostProps {
  user?: IUser;
}

function PostPage(props: PostProps) {
  const { user } = props;
  const { postNumber } = useParams();

  // getPost(postNumber)

  return (
    <div className="PostPage">
      <Header user={user} moderatorView={false} />
      {/* TODO: Add Post */}
      <p>Post {postNumber}</p>
    </div>
  );
}

export default PostPage;
