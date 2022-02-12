import "./PostPage.css";
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
  const { postNumber } = useParams();
  const [post, setPost] = useState<IPost>();
  const [postStatus, setPostStatus] = useState<string>("loading...");

  useEffect(() => {
    getPost(Number(postNumber)).then((response) => {
      if (response.success && response.payload) {
        setPost(response.payload);
        setPostStatus("");
      } else {
        console.log(response.message);
        setPostStatus(response.message.toString() + " :(");
      }
    });
  }, [postNumber]);

  return (
    <>
      <div className="PostPage">
        {post ? (
          <Post user={props.user} post={post} />
        ) : (
          <p className="PostStatus">{postStatus}</p>
        )}
      </div>
    </>
  );
}

export default PostPage;
