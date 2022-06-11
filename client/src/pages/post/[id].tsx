import styles from "styles/PostPage.module.scss";
import IPost from "../../types/IPost";
import { getPost } from "../../gateways/PostGateway";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Post from "components/post/Post";
import { useQuery } from "react-query";
import { loadAuth } from "gateways/AuthGateway";
import NotFoundPage from "pages/404";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";

type PostPageProps = {
  postNumber: number;
};

const PostPage: NextPage = () => {
  const router = useRouter();
  const [loadingID, setLoadingID] = useState(true);
  const [postNumber, setPostNumber] = useState<number>(0);

  useEffect(() => {
    const num = Number(router.query.id as string);
    if (Number.isInteger(num)) {
      setPostNumber(num);
    }
    setLoadingID(false);
  }, [router.query.id]);

  if (loadingID) {
    return <p>Loading...</p>;
  }

  if (!postNumber) {
    return <NotFoundPage />;
  }

  return (
    <MainLayout
      title={"Post #" + postNumber}
      page={<PostPageMain postNumber={postNumber} />}
    />
  );
};

function PostPageMain(props: PostPageProps) {
  const {
    isLoading,
    error,
    data: user,
  } = useQuery("user", () =>
    loadAuth().then((response) => {
      if (response.success && response.payload) {
        return response.payload;
      }
    })
  );

  const [postStatus, setPostStatus] = useState<string>("loading...");

  // let initialSkipAnimation = false;
  // let initialPost: IPost | undefined;
  // const state: unknown = useLocation().state;
  // if (typeof state === "object" && state && "post" in state) {
  //   initialPost = (state as any)["post"];
  //   initialSkipAnimation = true;
  // }

  const [post, setPost] = useState<IPost>();
  // const [skipAnimation] = useState(initialSkipAnimation);

  useEffect(() => {
    getPost(props.postNumber).then((response) => {
      if (response.success && response.payload) {
        setPost(response.payload);
        setPostStatus("");
      } else {
        console.log(response.message);
        setPostStatus(response.message.toString() + " :(");
      }
    });
  }, [props.postNumber]);

  return (
    <div className={styles.PostPage}>
      {post ? (
        <Post post={post} skipAnimation={false} />
      ) : (
        <p className={styles.PostStatus}>{postStatus}</p>
      )}
    </div>
  );
}

export default PostPage;
