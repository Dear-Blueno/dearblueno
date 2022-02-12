import "./PostPage.css";
import IUser from "../../types/IUser";
import IPost from "../../types/IPost";
import { useLocation, useParams } from "react-router-dom";
import { getPost } from "../../gateways/PostGateway";
import { useEffect, useState } from "react";
import Post from "../../components/feeds/post/Post";

interface PostProps {
  user?: IUser;
}

function PostPage(props: PostProps) {
  const { postNumber } = useParams();
  const [postStatus, setPostStatus] = useState<string>("loading...");

  let initialSkipAnimation = false;
  let initialPost: IPost | undefined;
  const state: unknown = useLocation().state;
  if (typeof state === "object" && state && "post" in state) {
    initialPost = (state as any)["post"];
    initialSkipAnimation = true;
  }

  const [post, setPost] = useState(initialPost);
  const [skipAnimation] = useState(initialSkipAnimation);

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
          <Post user={props.user} post={post} skipAnimation={skipAnimation} />
        ) : (
          <p className="PostStatus">{postStatus}</p>
        )}
      </div>
    </>
  );
}

export default PostPage;
