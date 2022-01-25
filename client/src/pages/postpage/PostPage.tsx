import "./PostPage.css";
import Header from "../../components/header/Header";
import IUser from "../../types/IUser";
import IPost from "../../types/IPost";
import { useParams } from "react-router-dom";
import { getPost } from "../../gateways/PostGateway";
import { useEffect, useState } from "react";
import Post from "../../components/feeds/post/Post";

interface PostProps {
  user?: IUser;
}

function PostPage(props: PostProps) {
  const { user } = props;
  const { postNumber } = useParams();
  const [post, setPost] = useState<IPost>();
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPost(Number(postNumber)).then((response) => {
      if (response.success && response.payload) {
        setPost(response.payload);
      } else {
        console.log(response.message);
      }
    });
  }, [postNumber]);

  return (
    <>
      <Header user={user} moderatorView={false} searching={searching} setSearching={setSearching} setSearchQuery={setSearchQuery}/>
      <div className="PostPage">
        {post && <Post user={props.user} post={post} />}
      </div>
    </>
  );
}

export default PostPage;
